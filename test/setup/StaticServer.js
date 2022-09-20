import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

export default class StaticServer {
  static HTTP_PORT = 8000;

  static HTTP_HOST = '0.0.0.0';

  static CONTENT_TYPES = new Map([
    ['.aac', 'audio/aac'],
    ['.avif', 'image/avif'],
    ['.css', 'text/css'],
    ['.html', 'text/html'],
    ['.ico', 'image/vnd.microsoft.icon'],
    ['.ics', 'text/calendar'],
    ['.jar', 'application/java-archive'],
    ['.jpeg', 'image/jpeg'],
    ['.jpg', 'image/jpeg'],
    ['.js', 'text/javascript'],
    ['.json', 'application/json'],
    ['.jsonld', 'application/ld+json'],
    ['.mjs', 'text/javascript'],
    ['.mp3', 'audio/mpeg'],
    ['.mp4', 'video/mp4'],
    ['.mpeg', 'video/mpeg'],
    ['.oga', 'audio/ogg'],
    ['.ogv', 'video/ogg'],
    ['.ogx', 'application/ogg'],
    ['.opus', 'audio/opus'],
    ['.otf', 'font/otf'],
    ['.png', 'image/png'],
    ['.pdf', 'application/pdf'],
    ['.svg', 'image/svg+xml'],
    ['.ttf', 'font/ttf'],
    ['.txt', 'text/plain'],
    ['.wav', 'audio/wav'],
    ['.weba', 'audio/webm'],
    ['.webm', 'video/webm'],
    ['.webp', 'image/webp'],
    ['.woff', 'font/woff'],
    ['.woff2', 'font/woff2'],
    ['.xhtml', 'application/xhtml+xml'],
    ['.xml', 'application/xml'],
  ]);

  constructor() {
    this.httpServer = http.createServer();
  }

  /**
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @return {Promise<any>}
   */
  static async onHttpRequest(req, res) {
    if (req.method !== 'HEAD' && req.method !== 'GET') {
      res.statusCode = 405;
      res.end('INVALID METHOD');
      return;
    }
    const url = path.posix.normalize(req.url.split('#')[0].split('?')[0]);
    if (!url) {
      res.statusCode = 400;
      res.end('INVALID URL');
    }
    const fullPath = path.join(process.cwd(), url);
    try {
      const stats = await fs.stat(fullPath);
      res.setHeader('cache-control', 'no-store');
      if (!stats.isFile()) {
        res.statusCode = 200;
        res.write('<html><body><ul>');
        for (const file of await fs.readdir(fullPath)) {
          const linkPath = path.join(url, file);
          const content = `<li><a href="${linkPath}">${file}</a></li>`;
          res.write(content);
        }
        res.end('</ul></body></html>');
        return;
      }
      res.statusCode = 200;
      res.setHeader('content-length', stats.size);
    } catch {
      res.statusCode = 404;
      res.end('NOT FOUND');
      return;
    }
    const contentType = StaticServer.CONTENT_TYPES.get(path.extname(fullPath));
    if (contentType) {
      res.setHeader('content-type', contentType);
    }
    try {
      await pipeline(createReadStream(fullPath), res);
    } catch (e) {
      res.statusCode = 500;
      res.destroy(e);
    }
  }

  /**
   * @param {number} [port=HTTP_PORT]
   * @param {string} [host=HTTP_HOST]
    @return {Promise<ReturnType<http.Server['address']>>} */
  start(port = StaticServer.HTTP_PORT, host = StaticServer.HTTP_HOST) {
    return new Promise((resolve, reject) => {
      this.httpServer.addListener('error', reject);
      this.httpServer.listen({ port, host }, () => {
        this.httpServer.removeListener('error', reject);
        this.httpServer.keepAliveTimeout = 5000;
        this.httpServer.requestTimeout = 300_000;
        this.httpServer.setTimeout(120_000, (socket) => {
          socket?.destroy(new Error('SOCKET_TIMEOUT'));
        });
        this.httpServer.addListener('clientError', (err, socket) => {
          if (!socket || socket.destroyed || socket.writableEnded) return;
          socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
        this.httpServer.addListener('request', StaticServer.onHttpRequest);
        resolve(this.httpServer.address());
      });
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.httpServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

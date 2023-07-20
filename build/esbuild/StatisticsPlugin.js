import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, relative } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

/** @type {import('esbuild').Plugin} */
export default {
  name: 'statistics',
  setup(build) {
    build.onEnd(async ({ outputFiles }) => {
      const info = {
        timestamp: new Date().toLocaleString(),
      };
      await Promise.all(outputFiles.map(async (file) => {
        await mkdir(dirname(file.path), { recursive: true });
        await writeFile(file.path, file.contents);
        info[relative('', file.path)] = {
          raw: file.contents.length,
          brotli: brotliCompressSync(file.contents).length,
          gzip: gzipSync(file.contents).length,
        };
      }));

      console.log(info);
    });
  },
};

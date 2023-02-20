import { writeFileSync } from 'node:fs';
import { relative } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

/** @type {import('esbuild').Plugin} */
export default {
  name: 'statistics',
  setup(build) {
    build.onEnd(({ metafile, outputFiles }) => {
      const info = {
        timestamp: new Date().toLocaleString(),
      };
      for (const file of outputFiles) {
        writeFileSync(file.path, file.contents);
        info[relative('', file.path)] = {
          raw: file.contents.length,
          brotli: brotliCompressSync(file.contents).length,
          gzip: gzipSync(file.contents).length,
        };
      }
      if (metafile) {
        writeFileSync('meta.json', JSON.stringify(metafile));
      }
      console.log(info);
      console.log('Build completed.');
    });
  },
};

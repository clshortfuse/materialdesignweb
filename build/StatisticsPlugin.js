import { writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
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

      let { outdir } = build.initialOptions;
      if (!outdir) {
        // TODO: Match esbuild method of lowest common ancestor
        outdir = dirname(outputFiles[0].path);
      }

      if (metafile) {
        writeFileSync(join(outdir, 'meta.json'), JSON.stringify(metafile));
      }
      console.log(info);
      console.log('Build completed.');
    });
  },
};

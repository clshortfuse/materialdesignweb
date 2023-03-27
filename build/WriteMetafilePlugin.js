import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/** @type {import('esbuild').Plugin} */
export default {
  name: 'write metafile',
  setup(build) {
    build.onEnd(async ({ metafile, outputFiles }) => {
      if (!metafile) return;
      let { outdir } = build.initialOptions;
      if (!outdir) {
        // TODO: Match esbuild method of lowest common ancestor
        outdir = dirname(outputFiles[0].path);
      }
      await writeFile(join(outdir, 'meta.json'), JSON.stringify(metafile));
    });
  },
};

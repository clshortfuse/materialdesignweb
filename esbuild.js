import process from 'node:process';

import browserslistToEsbuild from 'browserslist-to-esbuild';
import esbuild from 'esbuild';

const target = browserslistToEsbuild();

const cliArgs = new Set(process.argv.slice(2));

const minify = cliArgs.has('--minify');

await esbuild.build({
  entryPoints: ['index.js'],
  format: 'esm',
  sourcemap: true,
  minify,
  watch: cliArgs.has('--watch'),
  bundle: true,
  legalComments: 'linked',
  target,
  outfile: 'index.min.js',
  inject: ['polyfills.js'],
  plugins: [{
    name: 'css import assertions',
    setup: (build) => {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const { outputFiles } = await esbuild.build({
          entryPoints: [args.path],
          bundle: true,
          minify,
          write: false,
          target,
        });
        const [file] = outputFiles;
        const { text } = file;
        const contents = `
          let contents = \`${text.trim().replaceAll(/`/g, '\\`')}\`;
          let styles;
          try {
            styles = new CSSStyleSheet();
            styles.replaceSync(contents);
          } catch (e) {
            styles = contents;
          }
          export default styles;`;
        return { contents };
      });
    },
  }],
});

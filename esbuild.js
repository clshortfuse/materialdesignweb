import browserslistToEsbuild from 'browserslist-to-esbuild';
import esbuild from 'esbuild';

const target = browserslistToEsbuild();

await esbuild.build({
  entryPoints: ['index.js'],
  format: 'esm',
  sourcemap: true,
  minify: true,
  bundle: true,
  watch: true,
  legalComments: 'linked',
  target,
  outfile: 'index.min.js',
  plugins: [{
    name: 'css import assertions',
    setup: (build) => {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const { outputFiles } = await esbuild.build({
          entryPoints: [args.path],
          bundle: true,
          // minify: true,
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

import { writeFileSync } from 'node:fs';
import path, { relative } from 'node:path';
import process from 'node:process';
import { brotliCompressSync, gzipSync } from 'node:zlib';

import browserslistToEsbuild from 'browserslist-to-esbuild';
import esbuild from 'esbuild';

const target = browserslistToEsbuild();

const cliArgs = new Set(process.argv.slice(2));

const isProduction = (process.env.NODE_ENV === 'production') || cliArgs.has('--production');
const minifyAll = cliArgs.has('--minify');
const minifyWhitespace = cliArgs.has('--minify-whitespace');
const minifyIdentifiers = cliArgs.has('--minify-identifiers');
const minifySyntax = cliArgs.has('--minify-syntax');
const serve = cliArgs.has('--serve');

const minify = minifyAll ? { minify: true } : {
  minifyWhitespace,
  minifyIdentifiers,
  minifySyntax,
};

/** @type {esbuild.BuildOptions} */
const buildOptions = {
  entryPoints: ['docs/demo.js'],
  format: 'esm',
  sourcemap: true,
  ...minify,
  watch: cliArgs.has('--watch'),
  bundle: true,
  keepNames: false,
  legalComments: 'linked',
  metafile: cliArgs.has('--metafile'),
  // inject: isProduction ? [] : ['./utils/metadata.js'],
  write: false,
  target,
  outfile: 'docs/demo.min.js',
  plugins: [{
    name: 'css import assertions',
    setup: (build) => {
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const { outputFiles } = await esbuild.build({
          entryPoints: [args.path],
          bundle: true,
          ...minify,
          write: false,
          target,
        });
        const [file] = outputFiles;
        const { text } = file;
        const contents = /* js */ `
          let contents = \`${text.trim().replaceAll(/`/g, '\\`')}\`;
          let sheet;
          try {
            sheet = new CSSStyleSheet();
            sheet.replaceSync(contents);
          } catch (e) {
            const doc = document.implementation.createHTMLDocument()
            const style = doc.createElement('style');
            style.textContent = contents;
            doc.head.append(style);
            sheet = style.sheet;
            // Note: Removing style from document will nullify sheet
          }
          export default sheet;`;
        return { contents };
      });
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
  }],
};

let server;
if (serve) {
  /** @type {esbuild.ServeOptions} */
  const serveOptions = {
    port: 5500,
    servedir: './',
    onRequest(args) {
      const localPath = path.join(serveOptions.servedir, args.path);
      if (localPath === buildOptions.outfile) {
        // console.log('accessed outfile');
      }
    },
  };

  server = await esbuild.serve(serveOptions, { entryPoints: [] });
  console.log('esbuild server is listening on port', serveOptions.port);
}

await Promise.all([
  server?.wait,
  esbuild.build(buildOptions),
]);

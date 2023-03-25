import path from 'node:path';
import process from 'node:process';

import browserslistToEsbuild from 'browserslist-to-esbuild';
import esbuild from 'esbuild';

// import CSSImportAssertionsPlugin from './CSSImportAssertionsPlugin.js';
import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';

import StatisticsPlugin from './StatisticsPlugin.js';

const target = browserslistToEsbuild();

const cliArgs = new Set(process.argv.slice(2));

const isProduction = (process.env.NODE_ENV === 'production') || cliArgs.has('--production');
const minifyAll = cliArgs.has('--minify');
const minifyWhitespace = cliArgs.has('--minify-whitespace');
const minifyIdentifiers = cliArgs.has('--minify-identifiers');
const minifySyntax = cliArgs.has('--minify-syntax');
const serve = cliArgs.has('--serve');
const watch = cliArgs.has('--watch');
const live = cliArgs.has('--live');

const minify = minifyAll ? { minify: true } : {
  minifyWhitespace,
  minifyIdentifiers,
  minifySyntax,
};

/** @type {esbuild.BuildOptions['banner']} */
const banner = {};
if (!isProduction && live) {
  banner.js = /* js */`
    new EventSource('/esbuild').addEventListener('change', () => window.location.reload());
  `;
}

/** @type {esbuild.BuildOptions} */
const buildOptions = {
  entryPoints: ['docs/demo.js'],
  entryNames: '[dir]/[name].min',
  format: 'esm',
  sourcemap: true,
  ...minify,
  banner,
  bundle: true,
  keepNames: false,
  legalComments: 'linked',
  metafile: cliArgs.has('--metafile'),
  write: false,
  drop: isProduction ? ['console'] : [],
  target,
  outdir: 'docs',
  plugins: [
    minifyTemplates(minify), writeFiles(),
    StatisticsPlugin,
  ],
};

const context = await esbuild.context(buildOptions);

if (watch) {
  await context.watch();
}

if (serve) {
  /** @type {esbuild.ServeOptions} */
  const serveOptions = {
    port: 5500,
    servedir: './docs',
    onRequest(args) {
      const localPath = path.join(serveOptions.servedir, args.path);
      if (localPath === buildOptions.outfile) {
        // console.log('accessed outfile');
      }
    },
  };

  const server = await context.serve(serveOptions);
  console.log(`esbuild server is listening on ${server.host}:${server.port}`);
}

if (!serve && !watch) {
  await context.rebuild();
  await context.dispose();
}

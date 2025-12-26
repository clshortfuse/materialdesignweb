import process from 'node:process';

import browserslistToEsbuild from 'browserslist-to-esbuild';
import CleanCSS from 'clean-css';
import esbuild from 'esbuild';

import { getSearchParams } from '../utils/cli.js';

import { minifyTemplateLiterals } from './esbuild/MinifyTemplateLiteralsPlugin.js';
import StatisticsPlugin from './esbuild/StatisticsPlugin.js';
import WriteMetafilePlugin from './esbuild/WriteMetafilePlugin.js';

const target = browserslistToEsbuild();

const cliArgs = getSearchParams();

const isProduction = (process.env.NODE_ENV === 'production')
  || cliArgs.has('production');

const noConsole = cliArgs.has('no-console');
const serve = cliArgs.has('serve');
const watch = cliArgs.has('watch');
const live = cliArgs.has('live');
const outdir = cliArgs.get('outdir');
const format = cliArgs.get('format') || 'iife';
let treeShaking;
switch (cliArgs.get('tree-shaking')) {
  case 'true': treeShaking = true; break;
  case 'false': treeShaking = false; break;
  default:
}
const entryPoints = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

const minify = cliArgs.has('minify') ? { minify: true } : {
  minifyWhitespace: cliArgs.has('minify-whitespace'),
  minifyIdentifiers: cliArgs.has('minify-identifiers'),
  minifySyntax: cliArgs.has('minify-syntax'),
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
  entryPoints,
  entryNames: '[dir]/[name].min',
  format,
  sourcemap: true,
  ...minify,
  banner,
  bundle: true,
  keepNames: false,
  legalComments: 'linked',
  metafile: cliArgs.has('metafile'),
  write: false,
  drop: isProduction || noConsole ? ['console'] : [],
  target,
  outdir,
  treeShaking,
  plugins: [
    minifyTemplateLiterals({
      async cssPreprocessor(css) {
        return await new Promise((resolve, reject) => {
          new CleanCSS().minify(css, (err, output) => {
            if (err) {
              reject(err);
            } else {
              resolve(output.styles);
            }
          });
        });
      },
    }),
    StatisticsPlugin,
    WriteMetafilePlugin, {
      name: 'emit completed',
      setup(build) {
        build.onEnd(() => {
          console.log('Build completed.');
        });
      },
    },
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
    servedir: outdir,
  };

  const server = await context.serve(serveOptions);
  console.log(`esbuild server is listening on ${server.host}:${server.port}`);
}

if (!serve && !watch) {
  await context.rebuild();
  await context.dispose();
}

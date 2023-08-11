import { relative } from 'node:path';

import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import outputSize from 'rollup-plugin-output-size';
import serve from 'rollup-plugin-serve';

import { minifyTemplateLiterals } from './rollup/plugin-minify-template-literals.js';
import { writeMetafile } from './rollup/plugin-write-metafile.js';

/**
 * @param {import('rollup').RollupOptions} args
 * @return {import('rollup').RollupOptions}
 */
export default function defineConfig(args) {
  return {
    output: {
      format: 'iife',
      entryFileNames: '[name].min.js',
      sourcemap: 'hidden',
    },
    plugins: [
      nodeResolve(),
      minifyTemplateLiterals(),

      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
          }],
        ],
      }),

      args.compact ? terser() : null,

      outputSize({
        gzip: true,
      }),

      writeMetafile(),

      process.env.SERVE ? serve({
        port: 5500,
        host: '0.0.0.0',
        contentBase: relative(process.cwd(), args.dir),
      }) : null,

    ],
  };
}

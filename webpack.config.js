/** eslint-env node */

import { readdirSync, statSync } from 'node:fs';
import { join as joinPath, dirname as parseDirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as eta from 'eta';
import sass from 'sass';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @typedef {import('webpack').Configuration} WebpackConfiguration */
/** @typedef {import('webpack-dev-server').Configuration} DevServerConfiguration */

// eslint-disable-next-line no-underscore-dangle
const __dirname = parseDirname(fileURLToPath(import.meta.url));

/**
 * @param {Record<string,string[]>} object
 * @param {string} key
 * @param {string} entry
 * @return {void}
 */
function addEntry(object, key, entry) {
  if (!object[key]) {
    object[key] = [entry];
  } else if (!object[key].includes(entry)) {
    object[key].push(entry);
  }
}

/**
 * @param {Object<string,string>} env
 * @return {Object}
 */
function getComponentsConfig(env) {
  const isProduction = env.prod != null || (process.env.NODE_ENV === 'production');
  const DEST = (isProduction ? 'dist/full' : 'test/full');
  return {
    entry: {
      materialdesignweb: [
        resolvePath(__dirname, './index.js'),
        resolvePath(__dirname, './index.scss'),
      ],
    },
    mode: process.env.NODE_ENV || 'development',
    devtool: 'nosources-source-map',
    optimization: {
      usedExports: false,
    },
    output: {
      filename: 'materialdesignweb.min.js',
      path: resolvePath(__dirname, DEST),
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        generateStatsFile: false,
        defaultSizes: 'gzip',
        logLevel: 'error',
      }),
    ],
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
            ],
          },
        },
      }, {
        test: /\.scss$/,
        use: [
          'file-loader?name=materialdesignweb.min.css',
          'extract-loader',
          'css-loader?import=false',
          'clean-css-loader?{"level":{2:{"restructureRules":true}}}',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      }],
    },
  };
}

/**
 * @param {Object<string,string>} env
 * @return {WebpackConfiguration}
 */
export default function getDocsConfig(env) {
  const isProduction = env.prod != null || (process.env.NODE_ENV === 'production');
  const DEST = (isProduction ? 'dist/docs' : 'test/docs');
  const plugins = [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: false,
      defaultSizes: 'gzip',
      logLevel: 'error',
    }),
  ];
  /** @type {Record<string, string[]>} */
  const entries = {};
  for (const folder of ['.', 'pwa', 'pages', 'themes']) {
    const folderPath = joinPath('./docs', folder);
    for (const filename of readdirSync(folderPath)) {
      if (filename[0] === '_') {
        continue;
      }
      if (filename.endsWith('.pug')) continue;
      if (statSync(joinPath(folderPath, filename)).isDirectory()) {
        continue;
      }
      const noExt = filename.slice(0, filename.lastIndexOf('.'));
      const fullPath = resolvePath(folderPath, filename);
      addEntry(entries, `${noExt}`, fullPath);
    }
  }

  const etaLoader = {
    loader: 'html-loader',
    options: {
      minimize: {
        collapseBooleanAttributes: true,
        minifyCSS: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      sources: false,
      preprocessor(content, loaderContext) {
        return eta.render(content, {}, {
          cache: false,
          filename: loaderContext.resourcePath,
          plugins: [{
            processTemplate: (str, config) => {
              loaderContext.addDependency(config.filename);
              return str;
            },
          }],
        });
      },
    },
  };

  let port = Number.parseInt(env.port ?? process.env.port, 10);
  if (Number.isNaN(port)) {
    port = 8080;
  }

  /** @type {WebpackConfiguration & {devServer: DevServerConfiguration}} */
  const webpackConfig = {
    entry: entries,
    context: resolvePath(__dirname, 'docs'),
    devtool: isProduction ? 'source-map' : 'nosources-source-map',
    mode: isProduction ? 'production' : 'development',
    devServer: {
      host: '0.0.0.0',
      port,
      // static: resolvePath(__dirname, DEST),
      compress: true,
      hot: false,
      liveReload: false,
      client: false,
    },
    output: {
      filename: '[name].min.js',
      chunkFilename: '[name].min.js',
      path: resolvePath(__dirname, DEST),
      clean: true,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin({
        extractComments: false,
      })],
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          framework: {
            test(module, chunks) {
              if (module && module.resource && /prerender/.test(module.resource)) {
                return false;
              }
              /** @type {import('webpack').ChunkGraph} */
              const { chunkGraph } = chunks;

              if (chunkGraph && [...chunkGraph.getModuleChunksIterable(module)]?.some((chunk) => chunk.name.match(/prerender/))) {
                return false;
              }
              if (module && module.resource && /[/\\]docs[/\\]/.test(module.resource)) {
                return false;
              }
              if (module && module.resource && /[/\\](components|core|adapters)[/\\]/.test(module.resource)) {
                return true;
              }
              return false;
            },
            name: 'entire-framework',
            minSize: 0,
            minChunks: 1,
            priority: 20,
            chunks: 'all',
            reuseExistingChunk: true,
          },
          default: {
            test(module, chunks) {
              if (module && module.resource && /prerender/.test(module.resource)) {
                return false;
              }
              /** @type {import('webpack').ChunkGraph} */
              const { chunkGraph } = chunks;
              if (chunkGraph && [...chunkGraph.getModuleChunksIterable(module)]?.some((chunk) => chunk.name.match(/prerender/))) {
                return false;
              }
              if (module && module.resource && /[/\\]docs[/\\]/.test(module.resource)) {
                return true;
              }
              return false;
            },
            name: 'docs.common',
            minSize: 0,
            minChunks: 2,
            priority: 0,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      },
    },
    module: {
      rules: [{
        test: /\.js$/,
        resolve: { fullySpecified: false },
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-private-methods',
              '@babel/plugin-proposal-private-property-in-object',
            ],
          },
        }],
      }, {
        test: /\.scss$/,
        use: [
          'file-loader?name=[name].min.css',
          'extract-loader',
          { loader: 'css-loader', options: { sourceMap: false } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              postcssOptions: {
                plugins: ['cssnano'],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              implementation: sass,
            },
          },
        ],
      }, {
        test: /\.eta$/,
        use: [
          'file-loader?&name=[name].html',
          'extract-loader',
          etaLoader,
        ],
      }],
    },
    plugins,
  };
  return webpackConfig;
}

/**
 * @param {Object<string,string>} env
 * @return {WebpackConfiguration}
 */
export function makeWebPackConfig(env = {}) {
  const target = env.target || process.env.target;
  if (target === 'docs') {
    return getDocsConfig(env);
  }
  return getComponentsConfig(env);
}

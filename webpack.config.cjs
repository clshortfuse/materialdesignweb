/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const eta = require('eta');
const sass = require('sass');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = (process.env.NODE_ENV === 'production');

/** @typedef {import('webpack').Configuration} WebpackConfiguration */

/**
 * @param {Object<string,string>} env
 * @return {Object}
 */
function getComponentsConfig(env) {
  const DEST = (isProduction ? 'dist/full' : 'test/full');
  return {
    entry: {
      materialdesignweb: [
        path.resolve(__dirname, './index.js'),
        path.resolve(__dirname, './index.scss'),
      ],
    },
    mode: process.env.NODE_ENV || 'development',
    devtool: 'nosources-source-map',
    optimization: {
      usedExports: false,
    },
    output: {
      filename: 'materialdesignweb.min.js',
      path: path.resolve(__dirname, DEST),
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
function getDocsConfig(env) {
  const plugins = [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: false,
      defaultSizes: 'gzip',
      logLevel: 'error',
    }),
  ];
  /** @type {Object.<string, string[]>} */
  const entries = {};
  ['.', 'pwa', 'pages', 'themes'].map((folder) => path.join('./docs', folder))
    .forEach((folderPath) => fs.readdirSync(folderPath).forEach((filename) => {
      if (filename[0] === '_') {
        return;
      }
      if (filename.endsWith('.pug')) return;
      if (fs.statSync(path.join(folderPath, filename)).isDirectory()) {
        return;
      }
      const noExt = filename.substring(0, filename.lastIndexOf('.'));
      if (!entries[`${noExt}`]) {
        entries[`${noExt}`] = [];
      }
      entries[`${noExt}`].push(path.resolve(`${folderPath}/${filename}`));
    }));
  const DEST = (isProduction ? 'dist/docs' : 'test/docs');

  let port = parseInt(env.port ?? process.env.port, 10);
  if (Number.isNaN(port)) {
    port = 8080;
  }

  /** @type {WebpackConfiguration} */
  const webpackConfig = {
    entry: entries,
    context: path.resolve(__dirname, 'docs'),
    devtool: isProduction ? 'source-map' : 'nosources-source-map',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devServer: {
      host: '0.0.0.0',
      port,
      // static: path.resolve(__dirname, DEST),
      compress: true,
      hot: false,
      liveReload: false,
      client: false,
    },
    output: {
      filename: '[name].min.js',
      chunkFilename: '[name].min.js',
      path: path.resolve(__dirname, DEST),
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          framework: {
            test(module, chunks) {
              if (module && module.resource && module.resource.match(/prerender/)) {
                return false;
              }
              /** @type {import('webpack').ChunkGraph} */
              const { chunkGraph } = chunks;

              if (chunkGraph && [...chunkGraph.getModuleChunksIterable(module)]?.some((chunk) => chunk.name.match(/prerender/))) {
                return false;
              }
              if (module && module.resource && module.resource.match(/[\\/]docs[\\/]/)) {
                return false;
              }
              if (module && module.resource && module.resource.match(/[\\/](components|core|adapters)[\\/]/)) {
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
              if (module && module.resource && module.resource.match(/prerender/)) {
                return false;
              }
              /** @type {import('webpack').ChunkGraph} */
              const { chunkGraph } = chunks;
              if (chunkGraph && [...chunkGraph.getModuleChunksIterable(module)]?.some((chunk) => chunk.name.match(/prerender/))) {
                return false;
              }
              if (module && module.resource && module.resource.match(/[\\/]docs[\\/]/)) {
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
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader?{"presets":["@babel/preset-env"]}',
        ],
      }, {
        test: /\.scss$/,
        use: [
          'file-loader?name=[name].min.css',
          'extract-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['cssnano'],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      }, {
        test: /\.eta$/,
        use: [
          'file-loader?&name=[name].html',
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              minimize: {
                collapseBooleanAttributes: true,
                minifyCSS: true,
              },
              attributes: false,
              preprocessor(content, loaderContext) {
                return eta.render(content, {}, { filename: loaderContext.resourcePath });
              },
            },
          },
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
function makeWebPackConfig(env = {}) {
  const target = env.target || process.env.target;
  if (target === 'docs') {
    return getDocsConfig(env);
  }
  return getComponentsConfig(env);
}

module.exports = makeWebPackConfig;

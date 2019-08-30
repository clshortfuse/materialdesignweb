const path = require('path');
const fs = require('fs');
const sass = require('sass');
const fibers = require('fibers');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = (process.env.NODE_ENV === 'production');

/** @typedef {import('webpack').Configuration} WebpackConfiguration */
/** @typedef {import('webpack').compilation.Chunk} WebpackChunk */

/** @return {Object} */
function getComponentsConfig() {
  const DEST = (isProduction ? 'dist' : 'test/dist');
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
              fiber: fibers,
            },
          },
        ],
      }],
    },
  };
}

/** @return {WebpackConfiguration} */
function getDocsConfig() {
  const plugins = [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: false,
      defaultSizes: 'gzip',
    }),
  ];
  /** @type {Object.<string, string[]>} */
  const entries = {};
  ['.', 'pwa', 'pages', 'themes'].map((folder) => path.join('./docs-src', folder))
    .forEach((folderPath) => fs.readdirSync(folderPath).forEach((filename) => {
      if (filename[0] === '_') {
        return;
      }
      if (fs.statSync(path.join(folderPath, filename)).isDirectory()) {
        return;
      }
      const noExt = filename.substring(0, filename.lastIndexOf('.'));
      if (!entries[`${noExt}`]) {
        entries[`${noExt}`] = [];
      }
      entries[`${noExt}`].push(path.resolve(`${folderPath}/${filename}`));
    }));
  const DEST = (isProduction ? 'docs' : 'test/docs');
  /** @type {WebpackConfiguration} */
  const webpackConfig = {
    entry: entries,
    context: path.resolve(__dirname, 'docs-src'),
    devtool: isProduction ? 'source-map' : 'nosources-source-map',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devServer: {
      contentBase: path.resolve(__dirname, DEST),
      compress: true,
      inline: false,
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
            test(module, /** @type {WebpackChunk[]} */chunks) {
              if (module && module.resource && module.resource.match(/prerender/)) {
                return false;
              }
              if (chunks && chunks.some((chunk) => chunk.name.match(/prerender/))) {
                return false;
              }
              if (module && module.resource && module.resource.match(/[\\/]docs-src[\\/]/)) {
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
            test(module, /** @type {WebpackChunk[]} */ chunks) {
              if (module && module.resource && module.resource.match(/prerender/)) {
                return false;
              }
              if (chunks && chunks.some((chunk) => chunk.name.match(/prerender/))) {
                return false;
              }
              if (module && module.resource && module.resource.match(/[\\/]docs-src[\\/]/)) {
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
          'css-loader?import=false',
          'clean-css-loader?level=2',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              fiber: fibers,
            },
          },
        ],
      }, {
        test: /\.pug$/,
        use: [
          'file-loader?&name=[name].html',
          'extract-loader',
          'html-loader',
          'pug-html-loader',
        ],
      }],
    },
    plugins,
  };
  return webpackConfig;
}

/**
 * @param {Object} env
 * @return {WebpackConfiguration}
 */
function makeWebPackConfig(env = {}) {
  if (env.target === 'docs') {
    return getDocsConfig();
  }
  return getComponentsConfig();
}

module.exports = makeWebPackConfig;

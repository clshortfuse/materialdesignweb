const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProduction = (process.env.NODE_ENV === 'production');
const DEST = (isProduction ? 'dist/' : 'test/');

/** @return {Object} */
function getComponentsConfig() {
  return {
    entry: ['./components/index.js', './components/default.scss'],
    devtool: isProduction ? undefined : 'nosources-source-map',
    output: {
      filename: 'materialdesignweb.min.js',
      path: path.resolve(__dirname, DEST, 'components'),
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'minify'],
          },
        },
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction,
              minimize: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction,
              plugins: [
                () => cssnano(),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          }],
          fallback: 'style-loader',
        }),
      }],
    },
    plugins: [
      new ExtractTextPlugin('materialdesignweb.min.css'),
    ],
  };
}

/** @return {Object} */
function getDemoConfig() {
  const extractStyles = new ExtractTextPlugin('[name].min.css');
  const extractHtml = new ExtractTextPlugin('index.html');
  return {
    entry: {
      // 'babel-polyfill',
      demo: ['./demo/demo.js', './demo/demo.scss', './demo/index.pug'],
      theming: ['./demo/theming.scss'],
      components: ['./demo/components.scss'],
      'theming.ie11': ['./demo/theming.ie11.scss'],
    },
    devtool: isProduction ? undefined : 'nosources-source-map',
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, DEST, 'demo'),
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: { browsers: ['last 2 versions', 'ie 11'] },
                useBuiltIns: true,
              }],
            ],
          },
        },
      }, {
        test: /\.scss$/,
        use: extractStyles.extract({
          use: [{
            loader: 'css-loader',
            options: {
              import: false,
              sourceMap: !isProduction,
              // minimize: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction,
              plugins: () => [
                autoprefixer({ grid: true }),
                cssnano(),
              ],
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          }],
          fallback: 'style-loader',
        }),
      }, {
        test: /\.pug$/,
        use: extractHtml.extract({
          use: [{
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true,
            },
          },
          ],
        }),
      }],
    },
    plugins: [
      extractStyles,
      extractHtml,
    ],
  };
}

/**
 * @param {Object} env
 * @return {Object}
 */
function makeWebPackConfig(env = {}) {
  if (env.target === 'demo') {
    return getDemoConfig();
  }
  return getComponentsConfig();
}

module.exports = makeWebPackConfig;

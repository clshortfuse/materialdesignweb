const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = (process.env.NODE_ENV === 'production');

/** @return {Object} */
function getComponentsConfig() {
  const DEST = (isProduction ? 'dist' : 'test/dist');
  return {
    entry: ['./components/index.js', './components/default.scss'],
    devtool: isProduction ? undefined : 'nosources-source-map',
    output: {
      filename: 'materialdesignweb.min.js',
      path: path.resolve(__dirname, DEST),
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
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
                () => cssnano({ preset: 'default' }),
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
      new UglifyJSPlugin({ sourceMap: true }),
    ],
  };
}

/** @return {Object} */
function getDocsConfig() {
  const extractStyles = new ExtractTextPlugin('[name].min.css');
  const extractHtml = new ExtractTextPlugin('[name].html');
  const entries = {
    'babel-polyfill': ['babel-polyfill'],
    prerender: ['./docs/src/prerender.js'],
    index: ['./docs/src/index.pug', './docs/src/index.js'],
    docs: ['./docs/src/docs.scss'],
    theming: ['./docs/src/theming.scss'],
    components: ['./docs/src/components.scss'],
    'theming.ie11': ['./docs/src/theming.ie11.scss'],
  };
  fs.readdirSync('./docs/src/core/')
    .forEach((filename) => {
      const noExt = filename.substring(0, filename.lastIndexOf('.'));
      if (!entries[`${noExt}`]) {
        entries[`${noExt}`] = [];
      }
      entries[`${noExt}`].push(`./docs/src/core/${filename}`);
    });
  fs.readdirSync('./docs/src/complex/')
    .forEach((filename) => {
      const noExt = filename.substring(0, filename.lastIndexOf('.'));
      if (!entries[`${noExt}`]) {
        entries[`${noExt}`] = [];
      }
      entries[`${noExt}`].push(`./docs/src/complex/${filename}`);
    });
  const DEST = (isProduction ? 'docs' : 'test/docs');
  return {
    entry: entries,
    devtool: isProduction ? 'source-map' : 'nosources-source-map',
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, DEST),
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
                cssnano({ preset: 'default', zindex: false }),
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
      new UglifyJSPlugin({ sourceMap: true }),
    ],
  };
}

/**
 * @param {Object} env
 * @return {Object}
 */
function makeWebPackConfig(env = {}) {
  if (env.target === 'docs') {
    return getDocsConfig();
  }
  return getComponentsConfig();
}

module.exports = makeWebPackConfig;

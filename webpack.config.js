const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnano = require('cssnano');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = (process.env.NODE_ENV === 'production');

/** @return {Object} */
function getComponentsConfig() {
  const extractStyles = new ExtractTextPlugin('[name].min.css');
  const DEST = (isProduction ? 'dist' : 'test/dist');
  return {
    entry: {
      materialdesignweb: ['./components/index.js', './components/_index.scss'],
    },
    devtool: isProduction ? undefined : 'nosources-source-map',
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
              ['env', { useBuiltIns: true }],
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
      }],
    },
    plugins: [
      extractStyles,
      new UglifyJSPlugin({ sourceMap: true }),
    ],
  };
}

/** @return {Object} */
function getDocsConfig() {
  const plugins = [];
  const extractStyles = new ExtractTextPlugin('[name].min.css');
  const extractHtml = new ExtractTextPlugin('[name].html');
  plugins.push(extractStyles);
  plugins.push(extractHtml);
  if (isProduction) {
    plugins.push(new UglifyJSPlugin({ sourceMap: true }));
  }
  const entries = {
    prerender: ['./docs/src/prerender.js'],
    index: ['./docs/src/index.pug', './docs/src/index.js'],
    docs: ['./docs/src/docs.scss'],
    theming: ['./docs/src/theming.scss'],
    components: ['./docs/src/components.scss'],
    'theming.ie11': ['./docs/src/theming.ie11.scss'],
  };

  fs.readdirSync('./docs/src/components/')
    .forEach((filename) => {
      const noExt = filename.substring(0, filename.lastIndexOf('.'));
      if (!entries[`${noExt}`]) {
        entries[`${noExt}`] = [];
      }
      entries[`${noExt}`].push(`./docs/src/components/${filename}`);
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
              ['env', { useBuiltIns: true }],
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
    plugins,
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

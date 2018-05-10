const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssnano = require('cssnano');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = (process.env.NODE_ENV === 'production');

/** @return {Object} */
function getComponentsConfig() {
  const extractStyles = new MiniCssExtractPlugin({ filename: '[name].min.css' });
  const DEST = (isProduction ? 'dist' : 'test/dist');
  return {
    entry: {
      materialdesignweb: [
        path.resolve(__dirname, './components/index.js'),
        path.resolve(__dirname, './components/_index.scss'),
      ],
    },
    mode: process.env.NODE_ENV || 'development',
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
        use: [
          MiniCssExtractPlugin.loader,
          {
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
                cssnano({
                  preset: 'default',
                  autoprefixer: false,
                  discardUnused: false,
                  reduceIdents: false,
                  zindex: false,
                  mergeIdents: false,
                }),
              ],
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
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
  const extractStyles = new MiniCssExtractPlugin({ filename: '[name].min.css' });
  plugins.push(extractStyles);
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

  Object.keys(entries).forEach((key) => {
    const pugFile = entries[key].find(filename => filename.substr(-4) === '.pug');
    if (!pugFile) {
      return;
    }
    const extractHtml = new HtmlWebpackPlugin({
      filename: `${key}.html`,
      template: pugFile,
      chunks: [key],
    });
    plugins.push(extractHtml);
  });

  const DEST = (isProduction ? 'docs' : 'test/docs');
  return {
    entry: entries,
    devtool: isProduction ? 'source-map' : 'nosources-source-map',
    mode: process.env.NODE_ENV || 'development',
    devServer: {
      contentBase: path.resolve(__dirname, DEST),
    },
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              import: false,
              sourceMap: !isProduction,
              // minimize: true,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction,
              plugins: () => [
                cssnano({
                  preset: 'default',
                  autoprefixer: false,
                  discardUnused: false,
                  reduceIdents: false,
                  zindex: false,
                  mergeIdents: false,
                }),
              ],
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
      }, {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: { pretty: true },
          },
        ],
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

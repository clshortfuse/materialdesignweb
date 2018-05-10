const path = require('path');
const fs = require('fs');
const cssnano = require('cssnano');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = (process.env.NODE_ENV === 'production');

/** @return {Object} */
function getComponentsConfig() {
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
          'file-loader?name=[name].min.css',
          'extract-loader',
          'css-loader?import=false',
          {
            loader: 'postcss-loader',
            options: {
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
          },
          'sass-loader',
        ],
      }],
    },
    plugins: [
      new UglifyJSPlugin(),
    ],
  };
}

/** @return {Object} */
function getDocsConfig() {
  const plugins = [];
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
          'file-loader?name=[name].min.css',
          'extract-loader',
          'css-loader?import=false',
          {
            loader: 'postcss-loader',
            options: {
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
          },
          'sass-loader',
        ],
      }, {
        test: /\.pug$/,
        use: [
          'file-loader?name=[name].html',
          'extract-loader',
          'html-loader',
          'pug-html-loader',
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

const path = require('path');
const fs = require('fs');
const cssnano = require('cssnano');

const isProduction = (process.env.NODE_ENV === 'production');

/** @return {Object} */
function getComponentsConfig() {
  const DEST = (isProduction ? 'dist' : 'test/dist');
  return {
    entry: {
      materialdesignweb: [
        path.resolve(__dirname, './index.js'),
        path.resolve(__dirname, './_index.scss'),
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
              ['@babel/preset-env'],
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
                cssnano(),
              ],
            },
          },
          'sass-loader',
        ],
      }],
    },
  };
}

/** @return {Object} */
function getDocsConfig() {
  const plugins = [];
  const entries = {
    prerender: ['./prerender.js'],
    index: ['./index.pug', './index.js'],
    docs: ['./docs.scss'],
    components: ['./components.scss'],
  };
  ['pwa', 'themes', 'components'].forEach(folder => fs.readdirSync(path.join('./docs-src', folder))
    .forEach((filename) => {
      if (filename[0] === '_') {
        return;
      }
      const noExt = filename.substring(0, filename.lastIndexOf('.'));
      if (!entries[`${noExt}`]) {
        entries[`${noExt}`] = [];
      }
      entries[`${noExt}`].push(`./${folder}/${filename}`);
    }));
  const DEST = (isProduction ? 'docs' : 'test/docs');
  return {
    entry: entries,
    context: path.resolve(__dirname, 'docs-src'),
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
              ['@babel/preset-env'],
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
                cssnano(),
              ],
            },
          },
          'sass-loader',
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

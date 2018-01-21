const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const isProduction = (process.env.NODE_ENV === 'production');
const DEST = (isProduction ? 'dist/' : 'test/');

const extractSass = new ExtractTextPlugin({
  filename: 'materialdesignweb.min.css',
});

const configuration = {
  entry: ['./components/index.js', './components/index.scss'],
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
      use: extractSass.extract({
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: !isProduction,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: !isProduction,
            plugins: () => autoprefixer(),
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
    extractSass,
  ],
};

module.exports = configuration;

'use strict';

const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const baseConfig = {
  context: __dirname,
  entry: {
    app: './index.js',
    styles: './styles/index.scss',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextWebpackPlugin('styles.css'),
  ],
};

module.exports = (env) => {
  switch (env) {
    case 'development':
    case 'production':
    default:
      return baseConfig;
  }
};

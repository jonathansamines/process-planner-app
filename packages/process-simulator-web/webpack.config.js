'use strict';

const path = require('path');
const merge = require('webpack-merge');
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
  devServer: {
    port: 9000,
    publicPath: '/dist/',
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

const developmentConfig = {
  devtool: 'inline-source-maps',
};

module.exports = (env) => {
  switch (env) {
    case 'production':
      return baseConfig;

    case 'development':
    default:
      return merge(
        baseConfig,
        developmentConfig
      );
  }
};

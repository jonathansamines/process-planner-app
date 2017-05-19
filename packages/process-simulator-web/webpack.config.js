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
  devServer: {
    port: 9000,
  },
};

module.exports = (env) => {
  switch (env) {
    case 'development':
      return merge(
        baseConfig,
        developmentConfig
      );
    case 'production':
    default:
      return baseConfig;
  }
};

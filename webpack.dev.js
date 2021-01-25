'use strict';
const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let basePath = path.join(__dirname, '/');
let fs = require('fs');
const MATOMO_VERSION = process.env.MATOMO_VERSION
  ? process.env.MATOMO_VERSION
  : 'Test';

let config = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.ejs',
      inject: 'head',
      chunks: ['signin'],
      signin: fs.readFileSync(require.resolve('signin/googleSignin.html')),
      matomo: fs.readFileSync(
        require.resolve(basePath + '/app/matomo' + MATOMO_VERSION + '.html')
      )
    })
  ],
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
});

module.exports = config;

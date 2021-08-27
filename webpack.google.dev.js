'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

let fs = require('fs');

let config = merge(common.config, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.ejs',
      inject: 'head',
      chunks: ['signin'],
      signin: fs.readFileSync(require.resolve('signin/googleSignin.html')),
      matomo: common.getMatomo()
    })
  ]
});

module.exports = config;

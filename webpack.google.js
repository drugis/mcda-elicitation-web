'use strict';
const {merge} = require('webpack-merge');
const prod = require('./webpack.prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {getMatomo} = require('./webpack.common');

let fs = require('fs');

module.exports = merge(prod, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.ejs',
      inject: 'head',
      chunks: ['signin'],
      signin: fs.readFileSync(require.resolve('signin/googleSignin.html')),
      matomo: getMatomo()
    })
  ]
});

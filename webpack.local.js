'use strict';
const merge = require('webpack-merge');
const dev = require('./webpack.dev');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
let basePath = path.join(__dirname, '/');
let fs = require('fs');

module.exports = merge.smart(dev, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.ejs',
      inject: 'head',
      chunks: ['signin'],
      signin: fs.readFileSync(basePath + 'app/localSignin.html')
    }),
  ]
});

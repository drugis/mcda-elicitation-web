'use strict';

const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let fs = require('fs');

let config = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.ejs',
      inject: 'head',
      chunks: ['signin'],
      signin: fs.readFileSync(require.resolve('signin/localSignin.html'))
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

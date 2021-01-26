'use strict';
const {mergeWithCustomize, unique} = require('webpack-merge');
const prod = require('./webpack.prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let fs = require('fs');

module.exports = mergeWithCustomize({
  customizeArray: unique(
    'plugins',
    ['HtmlWebpackPlugin'],
    (plugin) => plugin.constructor && plugin.constructor.name
  )
})(prod, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.ejs',
      inject: 'head',
      chunks: ['signin'],
      signin: fs.readFileSync(require.resolve('signin/localSignin.html'))
    })
  ]
});

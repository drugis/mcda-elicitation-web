'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
let basePath = path.join(__dirname, '/');
let fs = require('fs');

let config = {
  entry: {
    'main': basePath + '/app/js/main.js',
    'signin': basePath + 'app/js/signin.js',
    'manual': basePath + '/app/js/manual.js',
    'error': basePath + 'app/js/error.js'
  },

  output: {
    // Output directory
    path: basePath + '/dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },

  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'angular1-templateurl-loader'
      }],
      exclude: [/.*angular-foundation-6.*/] // uses $templatecache so dont replace 
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }, {
      test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/', // where the fonts will go
          publicPath: 'fonts/' // override the default path
        }
      }]
    }, {
      test: /\.(png|jp(e*)g|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8000, // Convert images < 8kb to base64 strings
          name: 'images/[hash]-[name].[ext]'
        }
      }]
    }]
  },

  resolve: {
    alias: {
      'mcda': basePath + '/app/js',
      'mcdaweb': basePath + '/app/js/mcda-web'
    },
    modules: [
      // Files path which will be referenced while bundling
      'node_modules',
      basePath + '/app'
    ],
    extensions: ['.css', 'html', '.js'] // File types
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.ejs',
      inject: 'head',
      chunks: ['main'],
      matomo: fs.readFileSync(require.resolve(basePath + '/app/matomo.html'))
    }),
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.ejs',
      inject: 'head',
      chunks: ['signin'],
      signin: fs.readFileSync(require.resolve('signin/googleSignin.html')),
      matomo: fs.readFileSync(require.resolve(basePath + '/app/matomo.html'))
    }),
    new HtmlWebpackPlugin({
      filename: 'manual.html',
      template: 'app/manual.ejs',
      inject: 'head',
      chunks: ['manual'],
      matomo: fs.readFileSync(require.resolve(basePath + '/app/matomo.html'))
    }),
    new HtmlWebpackPlugin({
      filename: 'error.html',
      template: 'app/error.ejs',
      inject: 'head',
      chunks: ['error'],
      matomo: fs.readFileSync(require.resolve(basePath + '/app/matomo.html'))
    }),
    new CleanWebpackPlugin(['dist'])
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  }
};

module.exports = config;

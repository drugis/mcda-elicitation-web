'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

let basePath = path.join(__dirname, '/');
let fs = require('fs');
const MATOMO_VERSION = process.env.MATOMO_VERSION
  ? process.env.MATOMO_VERSION
  : 'None';
const MCDA_HOST = process.env.MCDA_HOST;

const matomo =
  MATOMO_VERSION === 'None'
    ? ''
    : fs.readFileSync(
        require.resolve(basePath + '/app/matomo' + MATOMO_VERSION + '.html')
      );

let config = {
  entry: {
    main: basePath + '/app/ts/main.tsx',
    signin: basePath + 'app/js/signin.js',
    manual: basePath + '/app/js/manual.js',
    error: basePath + '/app/js/error.js'
  },

  output: {
    // Output directory
    path: basePath + '/tscomp/dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.tsx/, //FIXME limit to one file once reactification is complete
        loader: 'string-replace-loader',
        options: {
          search: '@MCDA_HOST',
          replace: MCDA_HOST,
          flags: 'g'
        }
      },
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        include: [/app\/ts/, /shared/]
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: [
          /.*\/app\/ts.*/,
          /node_modules/,
          /node-backend/,
          /.*interface.*/
        ]
      },
      {
        test: /\.html$/,
        use: [{loader: 'raw-loader', options: {esModule: false}}]
      },
      {
        test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/', // where the fonts will go
              publicPath: 'fonts/' // override the default path
            }
          }
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json'
      })
    ],
    alias: {
      'schema-basePath': basePath + '/schema/',
      mcda: basePath + '/app/js',
      mcdaweb: basePath + '/app/js/mcda-web',
      react: basePath + '/node_modules/react',
      'help-popup': basePath + '/node_modules/help-popup'
    },
    modules: [
      // Files path which will be referenced while bundling
      'node_modules',
      basePath + '/app'
    ],
    extensions: ['.css', 'html', '.js', '.ts', '.tsx'] // File types
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'app/index.ejs',
      inject: 'head',
      chunks: ['main'],
      matomo: matomo
    }),
    new HtmlWebpackPlugin({
      filename: 'manual.html',
      template: 'app/manual.ejs',
      inject: 'head',
      chunks: ['manual'],
      matomo: matomo
    }),
    new HtmlWebpackPlugin({
      filename: 'error.html',
      template: 'app/error.ejs',
      inject: 'head',
      chunks: ['error'],
      matomo: matomo
    }),
    new CleanWebpackPlugin()
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  }
};

module.exports = config;

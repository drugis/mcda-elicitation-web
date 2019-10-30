'use strict';

const webpackConfig = require('./webpack.dev');
delete webpackConfig.entry;
webpackConfig.plugins = [];
webpackConfig.optimization = {
  splitChunks: false,
  runtimeChunk: false
};

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '.',

    preprocessors: {
      // add webpack as preprocessor
      './frontend-test/test-main.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,
    
    beforeMiddleware: ['webpackBlocker'],

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      './frontend-test/test-problems.js',
      './frontend-test/test-main.js',
    ],

    exclude: [
      'app/js/main.js',
    ],
    reporters: ['progress', 'junit', 'coverage'],
    // coverageReporter: {
    //   type : 'html',
    //   dir : 'coverage/'
    // },
    junitReporter: {
      outputFile: 'frontend-test/test-results.xml'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    browsers: ['ChromeHeadless'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 20000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};

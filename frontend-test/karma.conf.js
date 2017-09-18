// Karma configuration
// Generated on Sun Jan 12 2014 11:41:44 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // plugins to load
    plugins : [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-junit-reporter',
      'karma-jasmine',
      'karma-requirejs',
      'karma-ng-html2js-preprocessor'
    ],


    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'frontend-test/test-main.js',
      'app/js/misc.js',
      'bower_components/angular/angular.js',
      {pattern: 'app/partials/*.html'},
      {pattern: 'app/js/**/*.js', included: false},
      {pattern: 'bower_components/**/*.js', included: false},
      {pattern: 'frontend-test/**/*.js', included: false}
    ],


    // list of files to exclude
    exclude: [
      'app/js/main.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'junit'],
    junitReporter :{
      outputFile: 'frontend-test/test-results.xml'
    },

        // generate js files from html templates to expose them during testing.

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      // stripPrefix: 'public/',
      // // prepend this to the
      // prependPrefix: 'served/',

      // // or define a custom transform function
      // cacheIdFromPath: function(filepath) {
      //   return cacheId;
      // },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      // moduleName: 'templates'
     
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


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 20000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false  
  });
};

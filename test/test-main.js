'use strict';

var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (file.indexOf("/unit/") != -1) {
      tests.push(file);
    }
  }
}

// var tests = [
//   //"/base/test/unit/controller.js",
//   "/base/test/unit/intervalSwing.js",
//   "/base/test/unit/ordinalSwing.js",
//   "/base/test/unit/partialValueFunction.js",
//   "/base/test/unit/taskDependencies.js"]

console.log(tests);

var foundationVersion = "5.0.2";

require.config({
  paths: {
    'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
    'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular',
    'angular-resource': '//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-resource',
    'angular-mocks': 'lib/angular-mocks',
    'jquery-slider': 'lib/jslider/bin/jquery.slider.min',
    'd3': '//cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min',
    'nvd3': '//cdnjs.cloudflare.com/ajax/libs/nvd3/1.0.0-beta/nv.d3.min',
    'jasmine': 'lib/jasmine/jasmine',
    'jasmine-html': 'lib/jasmine/jasmine-html',
    'NProgress': '//cdnjs.cloudflare.com/ajax/libs/nprogress/0.1.2/nprogress.min'
 },
  baseUrl: '/base/app/js',
  shim: {
    'angular': { exports : 'angular'},
    'angular-resource': { deps:['angular'], exports: 'angular-resource'},
    'angular-mocks': { deps: ['angular'], exports: 'angular.mock' },
    'underscore': { exports : '_'},
    'd3': { exports : 'd3'},
    'nvd3': { deps: ['d3'], exports : 'nv'},
    'jQuery': { exports : 'jQuery'},
    'jquery-slider': { deps: ['jQuery'] },
    'jasmine': { exports: 'jasmine' },
    'jasmine-html': { deps: ['jasmine'], exports: 'jasmine' },
    'NProgress': { deps: ['jQuery'], exports: "NProgress" },
  },
  priority: ['angular'],
  
  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});

window.name = "NG_DEFER_BOOTSTRAP!";
window.config = {
  examplesRepository: "/examples/",
  workspacesRepository: { service: "LocalWorkspaces" }
};


'use strict';

var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (file.indexOf("/unit/") != -1 && file.indexOf("bower_components") == -1 && file.indexOf("node_modules") == -1) {
      console.log('file: ' + file);
      tests.push(file);
    }
  }
}

require.config({
  paths: {
    'angular': 'bower_components/angular/angular',
    'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
    'angular-resource': 'bower_components/angular-resource/angular-resource',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'd3': 'bower_components/d3/d3.min',
    'foundation': 'bower_components/foundation/js/foundation.min',
    'jasmine': 'bower_components/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'bower_components/jasmine/lib/jasmine-core/jasmine-html',
    'jQuery': 'bower_components/jquery/dist/jquery.min',
    'jquery-slider': 'bower_components/jslider/dist/jquery.slider',
    'lodash': 'bower_components/lodash/lodash',
    'MathJax': 'bower_components/MathJax/MathJax.js?config=TeX-MML-AM_HTMLorMML',
    'mcda': 'app/js',
    'mmfoundation': 'bower_components/angular-foundation/mm-foundation',
    'nvd3': 'bower_components/nvd3-community/build/nv.d3',
    'templates': 'app/partials',
    'underscore': 'bower_components/underscore/underscore'
  },
  baseUrl: '/base',
  shim: {
    'angular': { exports : 'angular'},
    'angular-resource': { deps:['angular'], exports: 'angular-resource'},
    'angular-ui-router': { deps: ['angular'], exports: 'angular-ui-router'},
    'underscore': { exports : '_'},
    'angular-mocks': { deps: ['angular'], exports: 'angular.mock' },
    'd3': { exports : 'd3'},
    'nvd3': { deps: ['d3'], exports : 'nv'},
    'jQuery': { exports : 'jQuery'},
    'jquery-slider': { deps: ['jQuery'] },
    'jasmine': { exports: 'jasmine' },
    'jasmine-html': { deps: ['jasmine'], exports: 'jasmine' },
    'mmfoundation': { deps: ['angular'] },
    'templates/remark.html': {deps: ['angular']}
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
  workspacesRepository: { service: "LocalWorkspaces" },
  remarksRepository: { service: 'LocalRemarks'}
};

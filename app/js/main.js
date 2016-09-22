'use strict';

require.config({
  paths: {
    'angular': 'bower_components/angular/angular',
    'angular-cookies': 'bower_components/angular-cookies/angular-cookies',
    'angular-patavi-client': 'bower_components/angular-patavi-client/patavi',
    'angular-resource': 'bower_components/angular-resource/angular-resource.min',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'domReady': 'bower_components/requirejs-domready/domReady',
    'error-reporting': 'bower_components/error-reporting/errorReportingDirective',
    'jQuery': 'bower_components/jquery/dist/jquery.min',
    'jquery-slider': 'bower_components/jslider/dist/jquery.slider.min',
    'd3': 'bower_components/d3/d3.min',
    'lodash': 'bower_components/lodash/lodash',
    'MathJax': 'bower_components/MathJax/MathJax.js?config=TeX-AMS-MML_SVG',
    'nvd3': 'bower_components/nvd3-community/build/nv.d3',
    'mcda': '/app/js',
    'mmfoundation': 'bower_components/angular-foundation/dist/mm-foundation-tpls-0.9.0-SNAPSHOT.min',
    'underscore': 'bower_components/underscore/underscore-min'
  },
  baseUrl: '.',
  shim: {
    'angular': {
      exports: 'angular'
    },
    'angular-resource': {
      deps: ['angular'],
      exports: 'angular-resource'
    },
    'angular-cookies': {
      deps: ['angular'],
      exposrt: 'angular-cookies'
    },
    'angular-ui-router': {
      deps: ['angular']
    },
    'underscore': {
      exports: '_'
    },
    'MathJax': {
      exports: 'MathJax'
    },
    'd3': {
      exports: 'd3'
    },
    'nvd3': {
      deps: ['d3'],
      exports: 'nv'
    },
    'jQuery': {
      exports: 'jQuery'
    },
    'jquery-slider': {
      deps: ['jQuery']
    },
    'foundation': {
      deps: ['jQuery']
    },
    'mmfoundation': {
      deps: ['angular']
    },
    'error-reporting': {
      deps: ['angular']
    }
  },
  priority: ['angular']
});

window.name = "NG_DEFER_BOOTSTRAP!";
require(['require', 'angular', 'mcda/mcda-web'], function(require, angular) {
  require(['domReady!'], function(document) {
    angular.bootstrap(document, ['elicit']);
  });
});

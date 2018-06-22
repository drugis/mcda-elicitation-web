'use strict';

require.config({
  paths: {
    'angular': 'bower_components/angular/angular',
    'angular-cookies': 'bower_components/angular-cookies/angular-cookies',
    'angular-patavi-client': 'bower_components/angular-patavi-client/patavi',
    'angular-resource': 'bower_components/angular-resource/angular-resource.min',
    'angular-touch': 'bower_components/angular-touch/angular-touch',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'angularjs-slider': 'bower_components/angularjs-slider/dist/rzslider',
    'clipboard': 'bower_components/clipboard/dist/clipboard.min',
    'core-js': 'bower_components/core-js/client/shim.min',
    'd3': 'bower_components/d3/d3.min',
    'domReady': 'bower_components/requirejs-domready/domReady',
    'error-reporting': 'bower_components/error-reporting/errorReportingDirective',
    'export-directive': 'bower_components/export-directive/export-directive',
    'help-popup': 'bower_components/help-popup/help-directive',
    'jQuery': 'bower_components/jquery/dist/jquery.min',
    'lodash': 'bower_components/lodash/lodash',
    'MathJax': 'bower_components/MathJax/MathJax.js?config=TeX-AMS-MML_SVG',
    'mmfoundation': 'bower_components/angular-foundation-6/dist/angular-foundation',
    'nvd3': 'bower_components/nvd3/build/nv.d3',
    'chartjs': 'bower_components/chart.js/dist/Chart',
    'mcda': '/js'
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
      exports: 'angular-cookies'
    },
    'angular-touch': {
      deps: ['angular'],
      exports: 'ngTouch'
    },
    'angular-ui-router': {
      deps: ['angular']
    },
    'help-popup': {
      deps: ['angular']
    },
    'lodash': {
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
    'foundation': {
      deps: ['jQuery']
    },
    'mmfoundation': {
      deps: ['angular']
    },
    'error-reporting': {
      deps: ['angular']
    },
    'export-directive': {
      deps: ['angular', 'd3', 'lodash', 'jQuery']
    }
  },
  priority: ['angular']
});

window.name = 'NG_DEFER_BOOTSTRAP!';
require(['require', 'angular', 'mcda/mcda-web'], function(require, angular) {
  require(['domReady!'], function(document) {
    angular.bootstrap(document, ['elicit']);
  });
});

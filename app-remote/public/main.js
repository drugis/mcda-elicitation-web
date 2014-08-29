'use strict';

require.config({
  paths: {
    'jQuery': 'bower_components/jquery/jquery.min',
    'underscore': 'bower_components/underscore/underscore-min',
    'angular': 'bower_components/angular/angular',
    'angular-resource': 'bower_components/angular-resource/angular-resource.min',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
    'foundation': 'bower_components/foundation/js/foundation.min',
    'domReady': 'bower_components/requirejs-domready/domReady',
    'mcda': 'bower_components/mcda-web/app/js',
    'NProgress': 'bower_components/nprogress/nprogress',
    'd3': 'bower_components/d3/d3.min',
    'nvd3': 'bower_components/nvd3/nv.d3.min'
  },
  baseUrl: '.',
  shim: {
    'angular': { exports : 'angular' },
    'angular-resource': { deps:['angular'], exports: 'angular-resource' },
    'angular-ui-router': { deps:['angular'] },
    'underscore': { exports : '_' },
    'jQuery': { exports : 'jQuery' },
    'foundation':  { deps: ['jQuery'] }
  },
  priority: ['angular']
});

window.name = "NG_DEFER_BOOTSTRAP!";

require(['require', 'angular', 'temp', 'mcda/mcda-web'], function (require, angular) {
  require(['domReady!'], function (document) {
    angular.bootstrap(document , ['temp']);
  });
});

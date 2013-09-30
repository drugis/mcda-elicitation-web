require.config({
  paths: {
    'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
    'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular',
    'angular-resource': '//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-resource',
    'jquery-slider': '/scripts/lib/jslider/bin/jquery.slider.min',
    'jquery-knob': '/scripts/lib/jquery.knob',
    'd3': '//cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min',
    'nvd3': '//cdnjs.cloudflare.com/ajax/libs/nvd3/1.0.0-beta/nv.d3.min'
  },
  shim: {
    'angular': { exports : 'angular'},
    'angular-resource': { deps:['angular'], exports: 'angular-resource'},
    'underscore': { exports : '_'},
    'd3': { exports : 'd3'},
    'nvd3': { deps: ['d3'], exports : 'nv'},
    'jQuery': { exports : 'jQuery'},
    'jquery-slider': { deps: ['jQuery'] },
    'jquery-knob': { deps: ['jQuery'] }
  }
});

require([
  'require',
  'angular',
  'elicit',
  'elicit/example-controller',
  'elicit/controller'
], function (require, angular) {
  require(['domReady!'], function (document) {
    angular.bootstrap(document , ['elicit']);
  });
});

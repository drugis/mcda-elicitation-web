'use strict';

require.config({
  paths: {
    'jQuery': 'bower_components/jquery/dist/jquery',
    'underscore': 'bower_components/underscore/underscore',
    'angular': 'bower_components/angular/angular',
    'angular-resource': 'bower_components/angular-resource/angular-resource',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'jquery-slider': 'bower_components/jslider/dist/jquery.slider',
    'd3': 'bower_components/d3/d3.min',
    'nvd3': 'bower_components/nvd3-community/build/nv.d3',
    'MathJax': 'bower_components/MathJax/MathJax.js?config=TeX-AMS-MML_SVG',
    'domReady': 'bower_components/requirejs-domready/domReady',
    'mcda': 'bower_components/mcda-web/app/js',
    'mmfoundation': 'bower_components/angular-foundation/mm-foundation-tpls'
  },
  baseUrl: '.',
  shim: {
    'angular': { exports : 'angular' },
    'angular-resource': { deps:['angular'], exports: 'angular-resource' },
    'angular-ui-router': { deps:['angular'] },
    'underscore': { exports : '_' },
    'MathJax' : { exports: 'MathJax' },
    'd3': { exports : 'd3' },
    'nvd3': { deps: ['d3'], exports : 'nv' },
    'jQuery': { exports : 'jQuery' },
    'jquery-slider': { deps: ['jQuery'] },
    'mmfoundation': { deps: ['angular'] }
  },
  priority: ['angular']
});


require(['require', 'angular', 'mcda/mcda-web'], function (require, angular) {
  angular.bootstrap(document , ['elicit']);
});

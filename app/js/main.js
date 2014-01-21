'use strict';

require.config({
  paths: {
    'jQuery': 'bower_components/jquery/jquery.min',
    'underscore': 'bower_components/underscore/underscore-min',
    'angular': 'bower_components/angular/angular.min',
    'angular-resource': 'bower_components/angular-resource/angular-resource.min',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
    'NProgress': 'bower_components/nprogress/nprogress',
x    'jquery-slider': 'lib/jslider/bin/jquery.slider.min',
    'd3': 'bower_components/d3/d3.min',
    'nvd3': 'bower_components/nvd3/nv.d3.min',
    'MathJax': 'bower_components/MathJax/MathJax.js?config=TeX-MML-AM_HTMLorMML',
    'foundation': 'bower_components/foundation/js/foundation.min'
  },
  baseUrl: 'app/js',
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
    'NProgress': { deps: ['jQuery'], exports: "NProgress" },
    'foundation':  { deps: ['jQuery'] }
  },
  priority: ['angular']
});

window.name = "NG_DEFER_BOOTSTRAP!";

// Add string HashCode
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (var i = 0; i < this.length; i++) {
    var character = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};


require(['require', 'angular', 'app'], function (require, angular) {
  require(['lib/domReady!'], function (document) {
    angular.bootstrap(document , ['elicit']);
  });
});

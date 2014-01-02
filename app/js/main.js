'use strict';
require.config({
  paths: {
    'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
    'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular',
    'angular-resource': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular-resource',
    'angular-ui-router': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.0/angular-ui-router.min',
    'NProgress': '//cdnjs.cloudflare.com/ajax/libs/nprogress/0.1.2/nprogress.min',
    'jquery-slider': '/app/js/lib/jslider/bin/jquery.slider.min',
    'd3': '//cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min',
    'nvd3': '//cdnjs.cloudflare.com/ajax/libs/nvd3/1.0.0-beta/nv.d3.min',
    'MathJax': '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.2/MathJax.js?config=TeX-MML-AM_HTMLorMML',
    'foundation': '//cdnjs.cloudflare.com/ajax/libs/foundation/4.3.2/js/foundation.min',
    'foundation.dropdown': '//cdnjs.cloudflare.com/ajax/libs/foundation/4.3.2/js/foundation/foundation.dropdown.min',
    'foundation.tooltip': '//cdnjs.cloudflare.com/ajax/libs/foundation/4.3.2/js/foundation/foundation.tooltips.min'
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
    'foundation':  { deps: ['jQuery'] },
    'foundation.section':  { deps: ['foundation'] },
    'foundation.tooltip':  { deps: ['foundation'] }
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

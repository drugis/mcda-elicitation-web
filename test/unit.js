require.config({
  paths: {
    'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
    'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular',
    'angular-resource': '//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-resource',
    'angular-mocks': '/app/js/lib/angular-mocks',
    'jquery-slider': '/app/js/lib/jslider/bin/jquery.slider.min',
    'd3': '//cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min',
    'nvd3': '//cdnjs.cloudflare.com/ajax/libs/nvd3/1.0.0-beta/nv.d3.min',
    'jasmine': '/app/js/lib/jasmine/jasmine',
    'jasmine-html': '/app/js/lib/jasmine/jasmine-html',
    'NProgress': '//cdnjs.cloudflare.com/ajax/libs/nprogress/0.1.2/nprogress.min'
  },
  baseUrl: '/app/js',
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
    'NProgress': { deps: ['jQuery'], exports: "NProgress" }
  }
});

require([
  'jasmine-html',
  'angular'
], function (jasmine) {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function (spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [
         '/test/unit/taskDependencies.js',
	       '/test/unit/partialValueFunction.js',
         '/test/unit/ordinalSwing.js',
	       '/test/unit/intervalSwing.js',
	       '/test/unit/controller.js'
         ];

  require(specs, function() {
    jasmineEnv.execute();
  });
});

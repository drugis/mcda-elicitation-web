'use strict';
require([
  'jasmine-html',
  'angular'
], function(jasmine) {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [
    '/test/unit/taskDependenciesSpec.js',
    '/test/unit/partialValueFunctionSpec.js',
    '/test/unit/ordinalSwingSpec.js'
  ];

  require(specs, function() {
    jasmineEnv.execute();
  });
});

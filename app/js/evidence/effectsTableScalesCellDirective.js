'use strict';
define([], function() {

  var dependencies = ['$timeout'];

  var EffectsTableScalesCellDirective = function($timeout) {
    return {
      restrict: 'E',
      scope: {
        'scales': '=',
        'uncertainty': '='
      },
      template: '<div>{{scales[\'50%\'] | number}}</div>' +
        '<div class="uncertain" ng-show="uncertainty">{{scales[\'2.5%\'] | number}}, {{scales[\'97.5%\'] | number}}</div>',
      link: function() {}
    };
  };
  return dependencies.concat(EffectsTableScalesCellDirective);
});
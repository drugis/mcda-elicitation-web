'use strict';
define(['lodash'], function(_) {

  var dependencies = ['$filter'];

  var EffectsTableScalesCellDirective = function($filter) {
    return {
      restrict: 'E',
      scope: {
        'scales': '=',
        'uncertainty': '=',
        'theoreticalScale': '=',
        'workspaceSettings': '='
      },
      template: '<div>{{median}}</div>' +
        '<div class="uncertain" ng-show="uncertainty">{{lowerBound}}, {{upperBound}}</div>',
      link: function(scope) {
        scope.$watch('scales', initScales);
        scope.$watch('workspaceSettings', initScales, true);

        function initScales() {
          if (scope.scales) {
            scope.lowerBound = getRoundedValue(scope.scales['2.5%']);
            scope.median = getRoundedValue(scope.workspaceSettings.effectsDisplay === 'mode' ? scope.scales.mode : scope.scales['50%']);
            scope.upperBound = getRoundedValue(scope.scales['97.5%']);
          }
        }

        function getRoundedValue(value) {
          if (value === null) { return; }
          if (!canBePercentage()) { return $filter('number')(value); }
          var numberOfDecimals = getNumberOfDecimals(value);
          return $filter('number')(value, numberOfDecimals);
        }

        function canBePercentage() {
          return _.isEqual(scope.theoreticalScale, [0, 1]);
        }

        function getNumberOfDecimals(value) {
          var numberOfDecimals = 1;
          if (Math.abs(value) < 0.01) {
            ++numberOfDecimals;
          }
          if (!scope.workspaceSettings.showPercentage && Math.abs(value) < 1) {
            numberOfDecimals += 2;
          }
          return numberOfDecimals;
        }
      }
    };
  };
  return dependencies.concat(EffectsTableScalesCellDirective);
});

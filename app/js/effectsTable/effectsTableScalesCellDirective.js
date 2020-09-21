'use strict';
define([], function () {
  var dependencies = ['EffectsTableService'];

  var EffectsTableScalesCellDirective = function (EffectsTableService) {
    return {
      restrict: 'E',
      scope: {
        scales: '=',
        uncertainty: '='
      },
      templateUrl: './effectsTableScalesCellDirective.html',
      link: function (scope) {
        scope.$watch('scales', initScales);
        scope.$on('elicit.settingsChanged', initScales);

        function initScales() {
          if (scope.scales) {
            scope.lowerBound = EffectsTableService.getRoundedValue(
              scope.scales['2.5%']
            );
            scope.median = EffectsTableService.getMedian(scope.scales);
            scope.upperBound = EffectsTableService.getRoundedValue(
              scope.scales['97.5%']
            );
          }
        }
      }
    };
  };
  return dependencies.concat(EffectsTableScalesCellDirective);
});

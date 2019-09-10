'use strict';
define(['lodash'], function(_) {

  var dependencies = [
    '$filter',
    'WorkspaceSettingsService'
  ];

  var EffectsTableScalesCellDirective = function(
    $filter,
    WorkspaceSettingsService) {
    return {
      restrict: 'E',
      scope: {
        'scales': '=',
        'uncertainty': '=',
        'theoreticalScale': '='
      },
      templateUrl: './effectsTableScalesCellDirective.html',
      link: function(scope) {
        scope.$watch('scales', initScales);
        scope.$on('elicit.settingsChanged', initScales);

        function initScales() {
          scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
          if (scope.scales) {
            scope.lowerBound = getRoundedValue(scope.scales['2.5%']);
            scope.median = getMedian();
            scope.upperBound = getRoundedValue(scope.scales['97.5%']);
          }
        }

        function getMedian(){
          if (scope.workspaceSettings.calculationMethod === 'mode'){
            return getMode();
          } else {
            return getRoundedValue(scope.scales['50%']);
          }
        }

        function getMode(){
          if (scope.scales.mode !== null){
            return getRoundedValue(scope.scales.mode);
          } else {
            return 'NA';
          }
        }

        function getRoundedValue(value) {
          if (value === null) {
            return;
          } else if (!canBePercentage()) {
            return $filter('number')(value);
          } else {
            var numberOfDecimals = getNumberOfDecimals(value);
            return $filter('number')(value, numberOfDecimals);
          }
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

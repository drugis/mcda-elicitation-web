'use strict';
define(['lodash'], function(_) {

  var dependencies = ['significantDigits'];

  var EffectsTableScalesCellDirective = function(significantDigits) {
    return {
      restrict: 'E',
      scope: {
        'effectsTableInfo': '=',
        'workspaceSettings': '=',
        'scales': '=',
        'theoreticalScale': '=',
        'alternativeId': '='
      },
      templateUrl: './effectsTableCellDirective.html',
      link: function(scope) {
        init();

        scope.$watch('workspaceSettings', init, true);

        function init() {
          scope.uncertainty = hasUncertainty(scope.effectsTableInfo);
          scope.effectsDisplay = scope.workspaceSettings.effectsDisplay;
          scope.isAbsolute = scope.effectsTableInfo.isAbsolute;
          scope.effectValue = '';
          if (scope.effectsTableInfo.studyDataLabelsAndUncertainty) {
            var foo = scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId];
            scope.effectLabel = foo.effectLabel;
            scope.distributionLabel = foo.distributionLabel;
            scope.effectValue = foo.effectValue;
            if(scope.effectValue !== '' && _.isEqual(scope.theoreticalScale, [0,100])){
              scope.effectValue *= 100;
            }
            scope.effectValue = significantDigits(scope.effectValue);
          }
        }

        function hasUncertainty(info) {
          return info.hasUncertainty || info.studyDataLabelsAndUncertainty[scope.alternativeId].hasUncertainty;
        }
      }

    };
  };
  return dependencies.concat(EffectsTableScalesCellDirective);
});

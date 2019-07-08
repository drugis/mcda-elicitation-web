'use strict';
define(['lodash'], function(_) {

  var dependencies = ['$filter'];

  var EffectsTableScalesCellDirective = function() {
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
            scope.effectLabel = scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId].effectLabel;
            scope.distributionLabel = scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId].distributionLabel;
            scope.effectValue = scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId].effectValue;
            if(scope.effectValue !== '' && _.isEqual(scope.theoreticalScale, [0,100])){
              scope.effectValue *= 100;
            }
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

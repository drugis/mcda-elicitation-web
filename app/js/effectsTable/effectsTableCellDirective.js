'use strict';
define(['lodash'], function(_) {

  var dependencies = [
    'significantDigits',
    'WorkspaceSettingsService'
  ];

  var EffectsTableScalesCellDirective = function(
    significantDigits,
    WorkspaceSettingsService
  ) {
    return {
      restrict: 'E',
      scope: {
        effectsTableInfo: '=',
        scales: '=',
        alternativeId: '=',
        unitOfMeasurementType: '='
      },
      templateUrl: './effectsTableCellDirective.html',
      link: function(scope) {
        init();
        scope.$on('elicit.settingsChanged', init);
        scope.$watch('scales', init, true);
        
        function init() {
          scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
          scope.isValueView = WorkspaceSettingsService.isValueView();
          scope.uncertainty = hasUncertainty(scope.effectsTableInfo);
          scope.effectsDisplay = scope.workspaceSettings.effectsDisplay;
          scope.effectValue = '';
          scope.effectLabel = '';
          scope.distributionLabel = '';
          if (scope.effectsTableInfo.studyDataLabelsAndUncertainty) {
            var labelsAndUncertainty = scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId];
            scope.effectLabel = labelsAndUncertainty.effectLabel;
            scope.distributionLabel = labelsAndUncertainty.distributionLabel;
            scope.effectValue = labelsAndUncertainty.effectValue;
            if (scope.effectValue !== '') {
              if (scope.unitOfMeasurementType === 'percentage') {
                scope.effectValue *= 100;
                scope.effectValue = significantDigits(scope.effectValue, 1);
              } else {
                scope.effectValue = significantDigits(scope.effectValue);
              }
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

'use strict';
define([], function() {

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
        scope.uncertainty = scope.effectsTableInfo.distributionType === 'relative' || scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId].hasUncertainty;
        scope.effectsDisplay = scope.workspaceSettings.effectsDisplay;
        scope.hasStudyData = scope.effectsTableInfo.hasStudyData;
        scope.distributionType = scope.effectsTableInfo.distributionType;
        scope.effectDataSourceLabel = scope.effectsTableInfo.studyDataLabelsAndUncertainty ? scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId].label : undefined;
      }

    };
  };
  return dependencies.concat(EffectsTableScalesCellDirective);
});

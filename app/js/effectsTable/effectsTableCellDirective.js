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
          scope.uncertainty = _.includes(scope.effectsTableInfo.distributionType , 'relative') || scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId].hasUncertainty;
          scope.effectsDisplay = scope.workspaceSettings.effectsDisplay;
          scope.hasStudyData = scope.effectsTableInfo.hasStudyData;
          scope.effectDataSourceLabel = scope.effectsTableInfo.studyDataLabelsAndUncertainty ? scope.effectsTableInfo.studyDataLabelsAndUncertainty[scope.alternativeId].label : undefined;
          scope.isEffect = _.includes(scope.effectsTableInfo.distributionType , 'exact');
        }
      }

    };
  };
  return dependencies.concat(EffectsTableScalesCellDirective);
});

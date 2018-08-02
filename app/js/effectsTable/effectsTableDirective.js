'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'EffectsTableService',
    'mcdaRootPath'
  ];
  var EffectsTableDirective = function(
    EffectsTableService,
    mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'alternatives': '=',
        'editMode': '=',
        'effectsTableInfo': '=',
        'scales': '=',
        'isStandAlone': '=', 
        'toggledColumns': '=',
        'workspaceSettings':'='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/effectsTable.html',
      link: function(scope) {
        // functions

        // init
        scope.studyDataAvailable = EffectsTableService.isStudyDataAvailable(scope.effectsTableInfo);
        scope.$watch('criteria', function(newCriteria) {
          scope.keyedCriteria = _.keyBy(_.cloneDeep(newCriteria), 'id');
          scope.rows = EffectsTableService.buildEffectsTable(scope.keyedCriteria);
        }, true);
        scope.$watch('alternatives', function(newAlternatives) {
          scope.nrAlternatives = _.keys(scope.alternatives).length;
          scope.alternatives = newAlternatives;
        });
        
      }
    };
  };
  return dependencies.concat(EffectsTableDirective);
});

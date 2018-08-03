'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'EffectsTableService',
    'WorkspaceSettingsService',
    'mcdaRootPath'
  ];
  var EffectsTableDirective = function(
    EffectsTableService,
    WorkspaceSettingsService,
    mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'alternatives': '=',
        'editMode': '=',
        'effectsTableInfo': '=',
        'scales': '=',
        'isStandAlone': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/effectsTable.html',
      link: function(scope) {
        // functions
        scope.getWorkspaceSettings = getWorkspaceSettings;

        // init
        scope.studyDataAvailable = EffectsTableService.isStudyDataAvailable(scope.effectsTableInfo);
        scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
        scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();

        scope.$watch('criteria', function(newCriteria) {
          scope.keyedCriteria = _.keyBy(_.cloneDeep(newCriteria), 'id');
          scope.rows = EffectsTableService.buildEffectsTable(scope.keyedCriteria);
        }, true);
        
        scope.$watch('alternatives', function(newAlternatives) {
          scope.nrAlternatives = _.keys(scope.alternatives).length;
          scope.alternatives = newAlternatives;
        }); 
        
        function getWorkspaceSettings() {
          scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
          scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
        }
    
      }
    };
  };
  return dependencies.concat(EffectsTableDirective);
});

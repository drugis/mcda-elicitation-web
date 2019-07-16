'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'EffectsTableService',
    'WorkspaceSettingsService'
  ];
  var EffectsTableDirective = function(
    EffectsTableService,
    WorkspaceSettingsService
  ) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'alternatives': '=',
        'editMode': '=',
        'effectsTableInfo': '=',
        'scales': '='
      },
      templateUrl: '../effectsTable/effectsTable.html',
      link: function(scope) {
        // init
        scope.studyDataAvailable = EffectsTableService.isStudyDataAvailable(scope.effectsTableInfo);
        getWorkspaceSettings();

        scope.$watch('criteria', function(newCriteria) {
          scope.keyedCriteria = _.keyBy(_.cloneDeep(newCriteria), 'id');
          scope.rows = EffectsTableService.buildEffectsTable(scope.keyedCriteria);
        }, true);

        scope.$watch('alternatives', function() {
          scope.nrAlternatives = _.keys(scope.alternatives).length;
          isCellAnalysisViable();
        });

        scope.$watch('scales', isCellAnalysisViable);

        scope.$on('elicit.settingsChanged', getWorkspaceSettings);

        function isCellAnalysisViable(){
          scope.isCellAnalysisViable = EffectsTableService.createIsCellAnalysisViable(
            scope.rows,
            scope.alternatives,
            scope.effectsTableInfo,
            scope.scales
          );
        }

        function getWorkspaceSettings() {
          scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
          scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
          scope.isValueView = WorkspaceSettingsService.isValueView();
        }

      }
    };
  };
  return dependencies.concat(EffectsTableDirective);
});

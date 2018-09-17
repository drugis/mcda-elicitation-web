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
        'scales': '=',
        'isStandAlone': '='
      },
      templateUrl: '../effectsTable/effectsTable.html',
      link: function(scope) {
        // functions
        // init
        scope.studyDataAvailable = EffectsTableService.isStudyDataAvailable(scope.effectsTableInfo);
        getWorkspaceSettings();

        scope.$watch('criteria', function(newCriteria) {
          scope.keyedCriteria = _.keyBy(_.cloneDeep(newCriteria), 'id');
          scope.rows = EffectsTableService.buildEffectsTable(scope.keyedCriteria);
        }, true);

        scope.$watch('alternatives', function(newAlternatives) {
          scope.nrAlternatives = _.keys(scope.alternatives).length;
          scope.alternatives = newAlternatives;
        });

        scope.$on('elicit.settingsChanged', getWorkspaceSettings);

        function getWorkspaceSettings() {
          scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
          scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
        }

      }
    };
  };
  return dependencies.concat(EffectsTableDirective);
});

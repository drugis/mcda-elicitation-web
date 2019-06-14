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

        scope.$watch('alternatives', function(newAlternatives) {
          scope.nrAlternatives = _.keys(scope.alternatives).length;
          scope.alternatives = newAlternatives;
          scope.isCellAnalysisViable = createIsCellAnalysisViable();
        });

        scope.$on('elicit.settingsChanged', getWorkspaceSettings);

        function createIsCellAnalysisViable() {
          return _(scope.rows).reduce(function(accum, row) {
            if (row.isHeaderRow) {
              return accum;
            } else {
              accum[row.dataSource.id] = _.reduce(scope.alternatives, function(accum, alternative) {
                accum[alternative.id] = !scope.effectsTableInfo[row.dataSource.id].isAbsolute || scope.effectsTableInfo[row.dataSource.id].studyDataLabelsAndUncertainty[alternative.id].effectValue !== '';
                return accum;
              }, {});
              return accum;
            }
          }, {});
        }

        function getWorkspaceSettings() {
          scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
          scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
          scope.isValueView = scope.workspaceSettings.effectsDisplay === 'smaa' ||
            scope.workspaceSettings.effectsDisplay === 'deterministicMCDA';
        }

      }
    };
  };
  return dependencies.concat(EffectsTableDirective);
});

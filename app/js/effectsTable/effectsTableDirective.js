'use strict';
define(['lodash', 'bowser'], function(_, bowser) {
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
          scope.rows = EffectsTableService.buildEffectsTable(newCriteria);
        }, true);

        scope.$watch('alternatives', function() {
          scope.nrAlternatives = _.keys(scope.alternatives).length;
          isCellAnalysisViable();
        });

        scope.$watch('scales', isCellAnalysisViable);

        scope.$on('elicit.settingsChanged', getWorkspaceSettings);

        var browser = bowser.getParser(window.navigator.userAgent).getBrowser().name;
        scope.isFirefox = browser === 'Firefox';
        scope.isChrome = browser === 'Chrome';

        function isCellAnalysisViable() {
          scope.isCellAnalysisViable = EffectsTableService.createIsCellAnalysisViable(
            scope.rows,
            scope.alternatives,
            scope.effectsTableInfo,
            scope.scales
          );
        }

        function getWorkspaceSettings() {
          scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
          scope.numberOfColumns = _.filter(scope.toggledColumns).length;
          scope.isValueView = WorkspaceSettingsService.isValueView();
        }
      }
    };
  };
  return dependencies.concat(EffectsTableDirective);
});

'use strict';
define(['angular', 'lodash'], function(angular, _) {
  var dependencies = [
    '$rootScope',
    '$stateParams',
    'WorkspaceSettingsResource'
  ];
  var WorkspaceSettingsService = function(
    $rootScope,
    $stateParams,
    WorkspaceSettingsResource
  ) {
    var DEFAULT_SETTINGS = {
      calculationMethod: 'median',
      showPercentages: true,
      effectsDisplay: 'deterministic'
    };

    var DEFAULT_TOGGLED_COLUMNS = {
      criteria: true,
      description: true,
      units: true,
      references: true,
      strength: true
    };

    var workspaceSettings = angular.copy(DEFAULT_SETTINGS);
    var toggledColumns = angular.copy(DEFAULT_TOGGLED_COLUMNS);

    function loadWorkspaceSettings(params) {
      return WorkspaceSettingsResource.get(params).$promise.then(function(result) {
        if (!_.includes(result.effectsDisplay, [
          'deterministic',
          'deterministicMCDA',
          'smaaDistributions',
          'smaa'
        ]));
        workspaceSettings = result.settings ? result.settings : DEFAULT_SETTINGS;
        toggledColumns = result.toggledColumns ? result.toggledColumns : DEFAULT_TOGGLED_COLUMNS;
      });
    }

    function getToggledColumns() {
      return angular.copy(toggledColumns);
    }

    function getWorkspaceSettings() {
      return angular.copy(workspaceSettings);
    }

    function saveSettings(newWorkspaceSettings, newToggledColumns) {
      var newSettings = {
        settings: newWorkspaceSettings,
        toggledColumns: newToggledColumns
      };
      return WorkspaceSettingsResource.put($stateParams, newSettings).$promise.then(function() {
        workspaceSettings = newWorkspaceSettings;
        toggledColumns = newToggledColumns;
        $rootScope.$broadcast('elicit.settingsChanged', newSettings);
      });
    }

    function getDefaults() {
      return {
        settings: angular.copy(DEFAULT_SETTINGS),
        toggledColumns: angular.copy(DEFAULT_TOGGLED_COLUMNS)
      };
    }

    function usePercentage() {
      return workspaceSettings.showPercentages;
    }

    return {
      loadWorkspaceSettings: loadWorkspaceSettings,
      getToggledColumns: getToggledColumns,
      getWorkspaceSettings: getWorkspaceSettings,
      saveSettings: saveSettings,
      getDefaults: getDefaults,
      usePercentage: usePercentage
    };
  };


  return dependencies.concat(WorkspaceSettingsService);
});

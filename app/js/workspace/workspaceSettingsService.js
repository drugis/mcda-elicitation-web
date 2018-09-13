'use strict';
define(['angular'], function(angular) {
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
      effectsDisplay: 'effects'
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

    function loadWorkspaceSettings() {
      return WorkspaceSettingsResource.get($stateParams).$promise.then(function(result) {
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
      return WorkspaceSettingsResource.put($stateParams, {
        settings: newWorkspaceSettings,
        toggledColumns: newToggledColumns
      }).$promise.then(function() {
        workspaceSettings = newWorkspaceSettings;
        toggledColumns = newToggledColumns;
        $rootScope.$broadcast('elicit.settingsChanged');
      });
    }

    function getDefaults() {
      return {
        settings: angular.copy(DEFAULT_SETTINGS),
        toggledColumns: angular.copy(DEFAULT_TOGGLED_COLUMNS)
      };
    }
    return {
      loadWorkspaceSettings: loadWorkspaceSettings,
      getToggledColumns: getToggledColumns,
      getWorkspaceSettings: getWorkspaceSettings,
      saveSettings: saveSettings,
      getDefaults: getDefaults
    };
  };


  return dependencies.concat(WorkspaceSettingsService);
});

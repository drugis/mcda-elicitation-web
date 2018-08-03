'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [
    '$stateParams',
    'WorkspaceSettingsResource'
  ];
  var WorkspaceSettingsService = function(
    $stateParams,
    WorkspaceSettingsResource
  ) {
    var defaultSettings = {
      calculationMethod: 'median',
      showPercentages: true,
      effectsDisplay: 'effects'
    };

    var defaultToggledColumns = {
      criteria: true,
      description: true,
      units: true,
      references: true,
      strength: true
    };

    var workspaceSettings = _.cloneDeep(defaultSettings);
    var toggledColumns = _.cloneDeep(defaultToggledColumns);

    function loadWorkspaceSettings() {
      WorkspaceSettingsResource.get($stateParams).$promise.then(function(result) {
        workspaceSettings = result.settings ? result.settings : workspaceSettings;
        toggledColumns = result.toggledColumns ? result.toggledColumns : toggledColumns;
      });
    }

    function getToggledColumns() {
      return toggledColumns;
    }

    function getWorkspaceSettings() {
      return workspaceSettings;
    }

    function saveSettings(newWorkspaceSettings, newToggledColumns, callback) {
      WorkspaceSettingsResource.save($stateParams, {
        settings: newWorkspaceSettings,
        toggledColumns: newToggledColumns
      }).$promise.then(function() {
        workspaceSettings = newWorkspaceSettings;
        toggledColumns = newToggledColumns;
        callback();
      });
    }

    function getDefaultSettings() {
      return {
        settings: _.cloneDeep(defaultSettings),
        toggledColumns: _.cloneDeep(defaultToggledColumns)
      };
    }
    return {
      loadWorkspaceSettings: loadWorkspaceSettings,
      getToggledColumns: getToggledColumns,
      getWorkspaceSettings: getWorkspaceSettings,
      saveSettings: saveSettings,
      getDefaultSettings: getDefaultSettings
    };
  };


  return dependencies.concat(WorkspaceSettingsService);
});

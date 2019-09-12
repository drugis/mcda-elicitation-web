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
      effectsDisplay: 'deterministic',
      hasNoEffects: false,
      isRelativeProblem: false
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
        workspaceSettings = result.settings ? result.settings : DEFAULT_SETTINGS;
        if (!hasValidView(workspaceSettings)) {
          workspaceSettings.effectsDisplay = 'deterministic';
        }
        toggledColumns = result.toggledColumns ? result.toggledColumns : DEFAULT_TOGGLED_COLUMNS;
      });
    }

    function hasValidView(workspaceSettings) {
      return _.includes([
        'deterministic',
        'deterministicMCDA',
        'smaaDistributions',
        'smaa'
      ], workspaceSettings.effectsDisplay);
    }

    function getToggledColumns() {
      return angular.copy(toggledColumns);
    }

    function getWorkspaceSettings(performanceTable) {
      setHasNoEffects(performanceTable);
      setHasNoAlternatives(performanceTable);
      return angular.copy(workspaceSettings);
    }

    function setHasNoEffects(performanceTable) {
      if (performanceTable && !hasEffect(performanceTable)) {
        if (workspaceSettings.effectsDisplay === 'deterministic') {
          workspaceSettings.effectsDisplay = 'smaa';
        }
        workspaceSettings.hasNoEffects = true;
      }
    }

    function hasEffect(performanceTable) {
      return _.some(performanceTable, function(entry) {
        return entry.performance.effect;
      });
    }

    function setHasNoAlternatives(performanceTable){
      if(performanceTable && !hasAlternative(performanceTable)){
        workspaceSettings.isRelativeProblem = true;
      }
    }

    function hasAlternative(performanceTable) {
      return _.some(performanceTable, function(entry) {
        return entry.alternative;
      });
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

    function isValueView() {
      return workspaceSettings.effectsDisplay === 'smaa' ||
        workspaceSettings.effectsDisplay === 'deterministicMCDA';
    }

    return {
      loadWorkspaceSettings: loadWorkspaceSettings,
      getToggledColumns: getToggledColumns,
      getWorkspaceSettings: getWorkspaceSettings,
      saveSettings: saveSettings,
      getDefaults: getDefaults,
      usePercentage: usePercentage,
      isValueView: isValueView
    };
  };


  return dependencies.concat(WorkspaceSettingsService);
});

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
      displayMode: 'enteredData',
      analysisType: 'deterministic',
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
        workspaceSettings = result.settings ? result.settings : angular.copy(DEFAULT_SETTINGS);
        if (workspaceSettings.hasOwnProperty('effectsDisplay')) {
          workspaceSettings.displayMode = getDisplayMode(workspaceSettings.effectsDisplay);
          workspaceSettings.analysisType = getAnalysiType(workspaceSettings.effectsDisplay);
          delete workspaceSettings.effectsDisplay;
        }
        toggledColumns = result.toggledColumns ? result.toggledColumns : angular.copy(DEFAULT_TOGGLED_COLUMNS);
      });
    }

    function getAnalysiType(effectsDisplay) {
      if (effectsDisplay === 'smaaDistributions' || effectsDisplay === 'smaa') {
        return 'smaa';
      } else {
        return 'deterministic';
      }
    }

    function getDisplayMode(effectsDisplay) {
      if (effectsDisplay === 'deterministicMCDA' || effectsDisplay === 'smaa') {
        return 'values';
      } else {
        return 'enteredData';
      }
    }

    function getToggledColumns() {
      return angular.copy(toggledColumns);
    }

    function getWorkspaceSettings(performanceTable) {
      setHasNoEffects(performanceTable);
      setIsRelativeProblem(performanceTable);
      return angular.copy(workspaceSettings);
    }

    function setHasNoEffects(performanceTable) {
      if (performanceTable && !hasEffect(performanceTable)) {
        if (workspaceSettings.analysisType === 'deterministic') {
          workspaceSettings.analysisType = 'smaa';
          workspaceSettings.displayMode = 'enteredData';
        }
        workspaceSettings.hasNoEffects = true;
      }
    }

    function hasEffect(performanceTable) {
      return _.some(performanceTable, function(entry) {
        return entry.performance.effect;
      });
    }

    function setIsRelativeProblem(performanceTable) {
      if (performanceTable && !hasAlternative(performanceTable)) {
        workspaceSettings.isRelativeProblem = true;
        if (workspaceSettings.displayMode === 'enteredData') {
          workspaceSettings.analysisType = 'smaa';
          workspaceSettings.displayMode = 'values';
        }
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
      return workspaceSettings.displayMode === 'values';
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

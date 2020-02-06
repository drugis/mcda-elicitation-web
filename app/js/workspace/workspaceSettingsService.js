'use strict';

define(['angular', 'lodash'], function(angular, _) {
  var dependencies = [
    '$rootScope',
    '$state',
    'WorkspaceSettingsResource'
  ];
  var WorkspaceSettingsService = function(
    $rootScope,
    $state,
    WorkspaceSettingsResource
  ) {
    var DEFAULT_SETTINGS = {
      calculationMethod: 'median',
      showPercentages: true,
      displayMode: 'enteredData',
      analysisType: 'deterministic',
      hasNoEffects: false,
      hasNoDistributions: false,
      isRelativeProblem: false,
      changed: false,
      randomSeed: 1234
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
        if (result.settings) {
          workspaceSettings = _.merge({}, DEFAULT_SETTINGS, result.settings);
        } else {
          workspaceSettings = angular.copy(DEFAULT_SETTINGS);
        }
        toggledColumns = result.toggledColumns ? result.toggledColumns : angular.copy(DEFAULT_TOGGLED_COLUMNS);
      });
    }

    function getToggledColumns() {
      return angular.copy(toggledColumns);
    }

    function setWorkspaceSettings(performanceTable) {
      setHasNoEffects(performanceTable);
      setHasNoDistributions(performanceTable);
      setIsRelativeProblem(performanceTable);
      return angular.copy(workspaceSettings);
    }

    function setHasNoEffects(performanceTable) {
      if (performanceTable && !hasEffect(performanceTable)) {
        if (!workspaceSettings.changed && workspaceSettings.analysisType === 'deterministic') {
          workspaceSettings.analysisType = 'smaa';
          workspaceSettings.displayMode = 'enteredData';
        }
        workspaceSettings.hasNoEffects = true;
      }
    }

    function setHasNoDistributions(performanceTable) {
      if (performanceTable && !hasDistribution(performanceTable)) {
        workspaceSettings.hasNoDistributions = true;
      }
    }

    function hasEffect(performanceTable) {
      return _.some(performanceTable, function(entry) {
        return entry.performance.effect;
      });
    }

    function hasDistribution(performanceTable) {
      return _.some(performanceTable, function(entry) {
        return entry.performance.distribution;
      });
    }

    function setIsRelativeProblem(performanceTable) {
      if (performanceTable && !hasAlternative(performanceTable)) {
        workspaceSettings.isRelativeProblem = true;
        if (!workspaceSettings.changed && workspaceSettings.displayMode === 'enteredData') {
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
      newSettings.settings.changed = true;
      return WorkspaceSettingsResource.put($state.params, newSettings).$promise.then(function() {
        var randomSeedChanged = hasRandomSeedChanged(newWorkspaceSettings.randomSeed);
        workspaceSettings = newWorkspaceSettings;
        toggledColumns = newToggledColumns;
        if (randomSeedChanged) {
          $state.reload();
        } else {
          $rootScope.$broadcast('elicit.settingsChanged', newSettings);
        }
      });
    }

    function hasRandomSeedChanged(newRandomSeed) {
      return workspaceSettings.randomSeed !== newRandomSeed;
    }

    function getDefaults() {
      var defaultSettings = _.merge(
        {},
        angular.copy(DEFAULT_SETTINGS),
        _.pick(workspaceSettings, ['isRelativeProblem', 'hasNoEffects', 'hasNoDistributions'])
      );

      if (defaultSettings.isRelativeProblem) {
        defaultSettings.analysisType = 'smaa';
        defaultSettings.displayMode = 'values';
      } else if (defaultSettings.hasNoEffects) {
        defaultSettings.analysisType = 'smaa';
      }

      return {
        settings: defaultSettings,
        toggledColumns: angular.copy(DEFAULT_TOGGLED_COLUMNS)
      };
    }

    function usePercentage() {
      return workspaceSettings.showPercentages;
    }

    function isValueView() {
      return workspaceSettings.displayMode === 'values';
    }

    function getWarnings(settings) {
      var warnings = [];
      if (hasNoEnteredData(settings)) {
        warnings.push('No entered data available.');
      } else if (hasNoEnteredEffect(settings)) {
        warnings.push('No entered data available for deterministic analysis.');
      } else if (hasNoEnteredDistribution(settings)) {
        warnings.push('No entered data available for SMAA analysis.');
      }
      return warnings;
    }

    function hasNoEnteredData(settings) {
      return settings.isRelativeProblem && settings.displayMode === 'enteredData';
    }

    function hasNoEnteredEffect(settings) {
      return settings.hasNoEffects &&
        settings.displayMode === 'enteredData' &&
        settings.analysisType === 'deterministic';
    }

    function hasNoEnteredDistribution(settings) {
      return settings.hasNoDistributions &&
        settings.displayMode === 'enteredData' &&
        settings.analysisType === 'smaa';
    }

    function getRandomSeed() {
      return workspaceSettings.randomSeed;
    }

    return {
      loadWorkspaceSettings: loadWorkspaceSettings,
      getToggledColumns: getToggledColumns,
      setWorkspaceSettings: setWorkspaceSettings,
      saveSettings: saveSettings,
      getDefaults: getDefaults,
      usePercentage: usePercentage,
      isValueView: isValueView,
      getWarnings: getWarnings,
      getRandomSeed: getRandomSeed
    };
  };
  return dependencies.concat(WorkspaceSettingsService);
});

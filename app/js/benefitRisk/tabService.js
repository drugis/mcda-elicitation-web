'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'WorkspaceService'
  ];
  var TabService = function(
    WorkspaceService
  ) {
    function getTabStatus(stateName, aggregateState, tasksAccessibility) {
      var hasMissingValues = WorkspaceService.checkForMissingValuesInPerformanceTable(aggregateState.problem.performanceTable);

      return {
        overview: {
          enabled: true,
          active: stateName === 'evidence'
        },
        problemDefinition: {
          enabled: true,
          active: stateName === 'problem'
        },
        preferences: getPreferencesTabStatus(stateName, hasMissingValues, tasksAccessibility),
        deterministic: getDeterministicTabStatus(stateName, hasMissingValues, tasksAccessibility),
        smaa: getSmaaTabStatus(stateName, hasMissingValues, tasksAccessibility)
      };
    }

    function getSmaaTabStatus(stateName, hasMissingValues, tasksAccessibility) {
      var status = getSmaaEnabledStatus(hasMissingValues, tasksAccessibility);
      return {
        enabled: status.enabled,
        tooltip: status.tooltip,
        active: stateName === 'smaa-results'
      };
    }

    function getSmaaEnabledStatus(hasMissingValues, tasksAccessibility) {
      if (hasMissingValues) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because effects table contains missing values'
        };
      } else if (!tasksAccessibility.preferences) {
        return {
          enabled: false,
          tooltip: 'Cannot set preferences because problem has multiple datasources per criterion'
        };
      } else if (!tasksAccessibility.results) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because not all partial value functions are set'
        };
      } else {
        return {
          enabled: true
        };
      }
    }

    function getDeterministicTabStatus(stateName, hasMissingValues, tasksAccessibility) {
      var status = getDeterministicEnabledStatus(hasMissingValues, tasksAccessibility);
      return {
        enabled: status.enabled,
        tooltip: status.tooltip,
        active: stateName === 'deterministic-results'
      };
    }

    function getDeterministicEnabledStatus(hasMissingValues, tasksAccessibility) {
      if (hasMissingValues) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because effects table contains missing values'
        };
      } else if (!tasksAccessibility.preferences) {
        return {
          enabled: false,
          tooltip: 'Cannot set preferences because problem has multiple datasources per criterion'
        };
      } else if (!tasksAccessibility.results) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because not all partial value functions are set'
        };
      } else {
        return {
          enabled: true
        };
      }
    }

    function getPreferencesTabStatus(stateName, hasMissingValues, tasksAccessibility) {
      var status = getPreferencesEnabledStatus(hasMissingValues, tasksAccessibility);
      return {
        enabled: status.enabled,
        tooltip: status.tooltip,
        active: isPreferencesTab(stateName)
      };
    }

    function getPreferencesEnabledStatus(hasMissingValues, tasksAccessibility) {
      if (hasMissingValues) {
        return {
          enabled: false,
          tooltip: 'Cannot elicit preferences because effects table contains missing values'
        };
      } else if (!tasksAccessibility.preferences) {
        return {
          enabled: false,
          tooltip: 'Cannot set preferences because problem has multiple datasources per criterion'
        };
      } else {
        return {
          enabled: true
        };
      }
    }

    function isPreferencesTab(stateName) {
      return _.some([
        'preferences',
        'partial-value-function',
        'ordinal-swing',
        'matching',
        'swing-weighting',
        'imprecise-swing-weighting'
      ], function(name) {
        return name === stateName;
      });
    }

    return {
      getTabStatus: getTabStatus
    };
  };

  return dependencies.concat(TabService);
});
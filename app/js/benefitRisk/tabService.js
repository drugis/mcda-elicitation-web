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
      var hasTooManyCriteria = _.keys(aggregateState.problem.criteria).length > 12;
      return {
        overview: {
          enabled: true,
          active: stateName === 'evidence'
        },
        problemDefinition: {
          enabled: true,
          active: stateName === 'problem'
        },
        preferences: getPreferencesTabStatus(stateName, hasMissingValues, hasTooManyCriteria, tasksAccessibility),
        deterministic: getDeterministicTabStatus(stateName, hasMissingValues, hasTooManyCriteria, tasksAccessibility),
        smaa: getSmaaTabStatus(stateName, hasMissingValues, hasTooManyCriteria, tasksAccessibility)
      };
    }

    function getSmaaTabStatus(stateName, hasMissingValues, hasTooManyCriteria, tasksAccessibility) {
      var status = getSmaaEnabledStatus(hasMissingValues, hasTooManyCriteria, tasksAccessibility);
      return {
        enabled: status.enabled,
        tooltip: status.tooltip,
        active: stateName === 'smaa-results'
      };
    }

    function getSmaaEnabledStatus(hasMissingValues, hasTooManyCriteria, tasksAccessibility) {
      if (hasMissingValues) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because the effects table contains missing values.'
        };
      } else if (hasTooManyCriteria) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because the effects table contains more than 12 criteria.'
        };
      } else if (!tasksAccessibility.preferences) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because the problem has multiple datasources per criterion.'
        };
      } else if (!tasksAccessibility.results) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because not all partial value functions are set.'
        };
      } else {
        return {
          enabled: true
        };
      }
    }

    function getDeterministicTabStatus(stateName, hasMissingValues, hasTooManyCriteria, tasksAccessibility) {
      var status = getDeterministicEnabledStatus(hasMissingValues, hasTooManyCriteria, tasksAccessibility);
      return {
        enabled: status.enabled,
        tooltip: status.tooltip,
        active: stateName === 'deterministic-results'
      };
    }

    function getDeterministicEnabledStatus(hasMissingValues, hasTooManyCriteria, tasksAccessibility) {
      if (hasMissingValues) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because the effects table contains missing values.'
        };
      } else if (hasTooManyCriteria) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because the effects table contains more than 12 criteria.'
        };
      } else if (!tasksAccessibility.preferences) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because the problem has multiple datasources per criterion.'
        };
      } else if (!tasksAccessibility.results) {
        return {
          enabled: false,
          tooltip: 'Cannot perform analysis because not all partial value functions are set.'
        };
      } else {
        return {
          enabled: true
        };
      }
    }

    function getPreferencesTabStatus(stateName, hasMissingValues, hasTooManyCriteria, tasksAccessibility) {
      var status = getPreferencesEnabledStatus(hasMissingValues, hasTooManyCriteria, tasksAccessibility);
      return {
        enabled: status.enabled,
        tooltip: status.tooltip,
        active: isPreferencesTab(stateName)
      };
    }

    function getPreferencesEnabledStatus(hasMissingValues, hasTooManyCriteria, tasksAccessibility) {
      if (hasMissingValues) {
        return {
          enabled: false,
          tooltip: 'Cannot elicit preferences because the effects table contains missing values.'
        };
      } else if (hasTooManyCriteria) {
        return {
          enabled: false,
          tooltip: 'Cannot elicit preferences because the effects table contains more than 12 criteria.'
        };
      } else if (!tasksAccessibility.preferences) {
        return {
          enabled: false,
          tooltip: 'Cannot elicit preferences because the problem has multiple datasources per criterion.'
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

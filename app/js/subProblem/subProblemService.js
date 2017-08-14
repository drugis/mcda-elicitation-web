'use strict';
define(function(require) {
  var dependencies = [];
  var _ = require('lodash');
  var SubProblemService = function() {
    // Exposed functions
    function createDefaultScenarioState(problem, subProblemState) {
      return {
        prefs: filterToObject(problem.preferences, subProblemState.criterionInclusions)
      };
    }

    function createDefinition(problem, subProblemState) {
      return {
        ranges: filterToObject(subProblemState.ranges, subProblemState.criterionInclusions),
        excludedCriteria: _.keys(_.omitBy(subProblemState.criterionInclusions)), // values are boolean
        excludedAlternatives: _.keys(_.omitBy(subProblemState.alternativeInclusions))
      };
    }

    function determineBaseline(performanceTable, alternatives) {
      return _.reduce(performanceTable, function(accum, performanceEntry) {
        if (performanceEntry.performance.parameters.baseline) {
          _.forEach(alternatives, function(alternative, key) {
            if (alternative.title === performanceEntry.performance.parameters.baseline.name) {
              accum[key] = true;
            }
          });
        }
        return accum;
      }, {});
    }

    function filterToObject(objects, inclusions) {
      var returnObject = {};
      _.forEach(objects, function(object, objectId) {
        if (inclusions[objectId]) {
          returnObject[objectId] = object;
        }
      });
      return returnObject;
    }
    return {
      createDefaultScenarioState: createDefaultScenarioState,
      createDefinition: createDefinition,
      determineBaseline: determineBaseline
    };
  };


  return dependencies.concat(SubProblemService);
});

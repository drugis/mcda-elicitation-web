'use strict';
define(function(require) {
  var dependencies = [];
  var _ = require('lodash');
  var SubProblemService = function() {
    // Exposed functions
    function createDefaultScenarioState(problem, subProblemState) {
      return {
        preferences: filterToObject(problem.preferences, subProblemState.criterionInclusions)
      };
    }

    function createDefinition(problem, subProblemState) {
      return {
        ranges: filterToObject(subProblemState.ranges, subProblemState.criterionInclusions),
        includedCriteria: filterToObject(problem.criteria, subProblemState.criterionInclusions)
      };
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
      createDefinition: createDefinition
    };
  };


  return dependencies.concat(SubProblemService);
});

'use strict';
define(function(require) {
  var _ = require('lodash');

  var dependencies = [];
  var SubProblemService = function() {
    // Exposed functions
    function createDefaultScenarioState(problem, subProblemState) {
      return {
        prefs: filterToObject(problem.preferences, subProblemState.criterionInclusions)
      };
    }

    function createDefinition(problem, subProblemState, scales) {
      return {
        ranges: createRanges(scales),
        excludedCriteria: _.keys(_.omitBy(subProblemState.criterionInclusions)), // values are boolean
        excludedAlternatives: _.keys(_.omitBy(subProblemState.alternativeInclusions))
      };
    }

    function determineBaseline(performanceTable, alternatives) {
      return _.reduce(performanceTable, function(accum, performanceEntry) {
        if (performanceEntry.performance.parameters && performanceEntry.performance.parameters.baseline) {
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

    function createCriterionInclusions(problem, subProblem) {
      return _.mapValues(problem.criteria, function(criterion, key) {
        return subProblem.definition && !_.includes(subProblem.definition.excludedCriteria, key);
      });
    }

    function createAlternativeInclusions(problem, subProblem) {
      return _.mapValues(problem.alternatives, function(alternative, key) {
        return subProblem.definition && !_.includes(subProblem.definition.excludedAlternatives, key);
      });
    }

    function checkScaleRanges(criteria) {
      var isMissingScaleRange = _.find(criteria, function(criterion) {
        return !(criterion.pvf && criterion.pvf.range && criterion.pvf.range[0] !== undefined && criterion.pvf.range[1] !== undefined);
      });
      return !isMissingScaleRange;
    }

    function isExact(performanceTable, criterion, alternative) {
      var perf = _.find(performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    }

    // private functions
    function createRanges(scales) {
      return _.fromPairs(_.map(scales, function(scale, criterionId) {
        return [criterionId, {
          pvf: {
            range: [scale.from, scale.to]
          }
        }];
      }));
    }

    return {
      createDefaultScenarioState: createDefaultScenarioState,
      createDefinition: createDefinition,
      determineBaseline: determineBaseline,
      createCriterionInclusions: createCriterionInclusions,
      createAlternativeInclusions: createAlternativeInclusions,
      checkScaleRanges: checkScaleRanges,
      isExact: isExact
    };
  };


  return dependencies.concat(SubProblemService);
});
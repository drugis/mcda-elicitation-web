'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [];
  var SubProblemService = function() {
    // Exposed functions
    function createDefaultScenarioState(problem, subProblemState) {
      return {
        prefs: filterToObject(problem.preferences, subProblemState.criterionInclusions)
      };
    }

    function createDefinition(subProblemState, scales) {
      return {
        ranges: createRanges(scales),
        excludedCriteria: _.keys(_.omitBy(subProblemState.criterionInclusions)), // values are boolean
        excludedAlternatives: _.keys(_.omitBy(subProblemState.alternativeInclusions))
      };
    }

    function determineBaseline(performanceTable, alternatives) {
      var keys = _.keys(alternatives);
      return _.reduce(performanceTable, function(accum, performanceEntry) {
        if (performanceEntry.performance.parameters && performanceEntry.performance.parameters.baseline) {
          _.forEach(keys, function(key) {
            if (key === performanceEntry.performance.parameters.baseline.name) {
              accum[key] = true;
            }
          });
        }
        return accum;
      }, {});
    }

    function filterToObject(objects, inclusions) {
      var returnObject = {};
      _.forEach(objects, function(object, objectKey) {
        if (inclusions[objectKey]) {
          returnObject[objectKey] = object;
        }
      });
      return returnObject;
    }

    function createCriterionInclusions(problem, subProblem) {
      return createInclusions(problem.criteria, subProblem.definition, 'excludedCriteria');
    }

    function createAlternativeInclusions(problem, subProblem) {
      return createInclusions(problem.alternatives, subProblem.definition, 'excludedAlternatives');
    }

    function createDataSourceInclusions(problem, subProblem) {
      return _.reduce(problem.criteria, function(accum, criterion) {
        return _.extend({}, accum, createInclusions(_.keyBy(criterion.dataSources, 'id'), subProblem.definition, 'excludedDataSources'));
      }, {});
    }

    function checkScaleRanges(criteria) {
      var isMissingScaleRange = _.find(criteria, function(criterion) {
        return !(criterion.pvf && criterion.pvf.range && criterion.pvf.range[0] !== undefined && criterion.pvf.range[1] !== undefined);
      });
      return !isMissingScaleRange;
    }

    function excludeCriteriaWithoutDataSources(criteria, subProblemState) {
      return _.mapValues(criteria, function(criterion, criterionId) {
        if(!subProblemState.criterionInclusions[criterionId]) {
          return false;
        }
        var dataSourcesForCriterion = _.pick(subProblemState.dataSourceInclusions, _.map(criterion.dataSources, 'id'));
        return _.filter(dataSourcesForCriterion).length > 0;
      });
    }

    // private functions
    function createInclusions(whatToInclude, definition, exclusionKey) {
      return _.reduce(_.keys(whatToInclude), function(accum,id) {
        var isIncluded = definition && !_.includes(definition[exclusionKey], id);
        accum[id] = isIncluded;
        return accum;
      },{});
    }

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
      createDataSourceInclusions: createDataSourceInclusions,
      checkScaleRanges: checkScaleRanges,
      excludeCriteriaWithoutDataSources: excludeCriteriaWithoutDataSources
    };
  };


  return dependencies.concat(SubProblemService);
});

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
        ranges: createRanges(scales, subProblemState.dataSourceInclusions),
        excludedCriteria: _.keys(_.omitBy(subProblemState.criterionInclusions)), // values are boolean
        excludedAlternatives: _.keys(_.omitBy(subProblemState.alternativeInclusions)),
        excludedDataSources: _.keys(_.omitBy(subProblemState.dataSourceInclusions))
      };
    }

    function determineBaseline(performanceTable, alternatives) {
      var alternativeKeys = _.keys(alternatives);
      return _.reduce(performanceTable, function(accum, performanceEntry) {
        if (performanceEntry.performance.parameters && performanceEntry.performance.parameters.baseline) {
          _.forEach(alternativeKeys, function(key) {
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
        return _.extend({}, accum, createInclusions(_.keyBy(criterion.dataSources, 'id'),
          subProblem.definition, 'excludedDataSources'));
      }, {});
    }

    function checkScaleRanges(criteria) {
      var isMissingScaleRange = _.find(criteria, function(criterion) {
        return !(criterion.dataSources[0].pvf && criterion.dataSources[0].pvf.range &&
          criterion.dataSources[0].pvf.range[0] !== undefined && criterion.dataSources[0].pvf.range[1] !== undefined);
      });
      return !isMissingScaleRange;
    }

    function excludeDataSourcesForExcludedCriteria(criteria, subProblemState) {
      return _.reduce(criteria, function(accum, criterion, criterionId) {
        if (!subProblemState.criterionInclusions[criterionId]) {
          _.forEach(criterion.dataSources, function(dataSource) {
            accum[dataSource.id] = false;
          });
        } else if (!_.find(criterion.dataSources, function(dataSource) {
          return subProblemState.dataSourceInclusions[dataSource.id];
        })) {
          _.forEach(criterion.dataSources, function(dataSource) {
            accum[dataSource.id] = true;
          });
        } else {
          accum = _.merge({}, accum, _.pick(subProblemState.dataSourceInclusions,
            _.map(criterion.dataSources, 'id')));
        }
        return accum;
      }, {});
    }

    // private functions
    function createInclusions(whatToInclude, definition, exclusionKey) {
      return _.reduce(_.keys(whatToInclude), function(accum, id) {
        var isIncluded = definition && !_.includes(definition[exclusionKey], id);
        accum[id] = isIncluded;
        return accum;
      }, {});
    }

    function createRanges(scales, includedDataSources) {
      return _(scales)
        .map(function(scale, dataSourceId) {
          return [dataSourceId, {
            pvf: {
              range: [scale.from, scale.to]
            }
          }];
        })
        .filter(function(scale) {
          return _.includes(_.keys(_.pickBy(includedDataSources)), scale[0]);
        })
        .fromPairs()
        .value();
    }

    return {
      createDefaultScenarioState: createDefaultScenarioState,
      createDefinition: createDefinition,
      determineBaseline: determineBaseline,
      createCriterionInclusions: createCriterionInclusions,
      createAlternativeInclusions: createAlternativeInclusions,
      createDataSourceInclusions: createDataSourceInclusions,
      checkScaleRanges: checkScaleRanges,
      excludeDataSourcesForExcludedCriteria: excludeDataSourcesForExcludedCriteria
    };
  };


  return dependencies.concat(SubProblemService);
});

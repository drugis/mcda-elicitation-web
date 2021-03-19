'use strict';
define(['lodash', 'angular'], function (_, angular) {
  var dependencies = [];

  var WorkspaceService = function () {
    function buildAggregateState(baseProblem, subProblem, scenario) {
      var newState = _.merge(
        {},
        {
          problem: mergeBaseAndSubProblem(baseProblem, subProblem.definition)
        },
        scenario.state
      );
      newState.problem.preferences = scenario.state.prefs;
      newState.problem.criteria = _.mapValues(
        newState.problem.criteria,
        function (criterion, criterionId) {
          return _.merge(
            {},
            criterion,
            _.omit(baseProblem.criteria[criterionId], ['pvf', 'dataSources'])
          );
          // omit because we don't want the base problem pvf to overwrite the current one
        }
      );
      newState.problem.alternatives = _.mapValues(
        newState.problem.alternatives,
        function (alternative, key) {
          return _.merge({}, alternative, baseProblem.alternatives[key]);
        }
      );
      newState.problem.criteria = addTheoreticalScales(
        newState.problem.criteria
      );
      return newState;
    }
    function addTheoreticalScales(criteria) {
      return updateDataSources(criteria, addTheoreticalScale);
    }

    function updateDataSources(criteria, fn) {
      return _.mapValues(criteria, function (criterion) {
        return _.extend({}, criterion, {
          dataSources: _.map(criterion.dataSources, fn)
        });
      });
    }

    function addTheoreticalScale(dataSource) {
      return _.extend({}, dataSource, {
        scale: getScales(dataSource)
      });
    }

    function getScales(dataSource) {
      if (dataSource.scale) {
        var scale = angular.copy(dataSource.scale);
        scale[0] = scale[0] !== null ? scale[0] : -Infinity;
        scale[1] = scale[1] !== null ? scale[1] : Infinity;
        return scale;
      } else {
        return [-Infinity, Infinity];
      }
    }

    function mergeBaseAndSubProblem(baseProblem, subProblemDefinition) {
      var newProblem = _.cloneDeep(baseProblem);
      if (subProblemDefinition.excludedCriteria) {
        newProblem.criteria = _.omit(
          newProblem.criteria,
          subProblemDefinition.excludedCriteria
        );
        newProblem.performanceTable = filterExcludedCriteriaEntries(
          newProblem,
          subProblemDefinition.excludedCriteria
        );
      }

      if (subProblemDefinition.excludedAlternatives) {
        newProblem.alternatives = filterExcludedAlternatives(
          newProblem,
          subProblemDefinition.excludedAlternatives
        );
        newProblem.performanceTable = filterExcludedAlternativesEntries(
          newProblem,
          subProblemDefinition.excludedAlternatives
        );
        newProblem.performanceTable = updateIncludedEntries(
          newProblem,
          subProblemDefinition
        );
      }

      if (subProblemDefinition.excludedDataSources) {
        newProblem.criteria = updateCriterionDataSources(
          newProblem,
          subProblemDefinition.excludedDataSources
        );
        newProblem.performanceTable = filterExcludedDataSourceEntries(
          newProblem,
          subProblemDefinition.excludedDataSources
        );
      }

      newProblem.criteria = createCriteriaWithRanges(
        newProblem,
        subProblemDefinition.ranges
      );
      return newProblem;
    }

    function createCriteriaWithRanges(problem, ranges) {
      return _.mapValues(problem.criteria, function (criterion) {
        var newCriterion = _.cloneDeep(criterion);
        newCriterion.dataSources = createDataSourcesWithRanges(
          newCriterion,
          ranges
        );
        return newCriterion;
      });
    }

    function createDataSourcesWithRanges(criterion, ranges) {
      return _.map(criterion.dataSources, function (dataSource) {
        var rangesForDataSource = getRanges(dataSource.id, ranges);
        return _.merge({}, dataSource, rangesForDataSource);
      });
    }

    function getRanges(dataSourceId, ranges) {
      if (ranges) {
        return {pvf: {range: ranges[dataSourceId]}};
      } else {
        return {};
      }
    }

    function filterExcludedDataSourceEntries(problem, excludedDataSources) {
      return _.reject(problem.performanceTable, function (tableEntry) {
        return _.includes(excludedDataSources, tableEntry.dataSource);
      });
    }

    function updateCriterionDataSources(problem, excludedDataSources) {
      return _.mapValues(problem.criteria, function (criterion) {
        var newCriterion = angular.copy(criterion);
        newCriterion.dataSources = filterDataSources(
          newCriterion.dataSources,
          excludedDataSources
        );
        return newCriterion;
      });
    }

    function filterDataSources(dataSources, excludedDataSources) {
      return _.filter(dataSources, function (dataSource) {
        return !_.includes(excludedDataSources, dataSource.id);
      });
    }

    function updateIncludedEntries(problem, subProblemDefinition) {
      return _.map(problem.performanceTable, function (entry) {
        if (!isAbsolutePerformance(entry)) {
          entry.performance.distribution.parameters.relative = updateRelative(
            entry.performance.distribution.parameters.relative,
            subProblemDefinition.excludedAlternatives
          );
        }
        return entry;
      });
    }

    function isAbsolutePerformance(tableEntry) {
      return (
        tableEntry.performance.effect ||
        (tableEntry.performance.distribution &&
          tableEntry.performance.distribution.type.indexOf('relative') < 0)
      );
    }

    function updateRelative(relative, excludedAlternatives) {
      return {
        ...relative,
        cov: reduceCov(relative.cov, excludedAlternatives),
        mu: reduceMu(relative.mu, excludedAlternatives)
      };
    }

    function filterExcludedCriteriaEntries(problem, excludedCriteria) {
      return _.reject(problem.performanceTable, function (tableEntry) {
        return (
          _.includes(excludedCriteria, tableEntry.criterionUri) ||
          _.includes(excludedCriteria, tableEntry.criterion)
        ); // addis/mcda standalone difference
      });
    }

    function filterExcludedAlternativesEntries(problem, excludedAlternative) {
      return _.reject(problem.performanceTable, function (tableEntry) {
        return _.includes(excludedAlternative, tableEntry.alternative);
      });
    }

    function filterExcludedAlternatives(problem, excludedAlternatives) {
      return _.pickBy(problem.alternatives, function (alternative, id) {
        return !_.includes(excludedAlternatives, id);
      });
    }

    function reduceCov(oldCov, excludedAlternatives) {
      var newCov = _.cloneDeep(oldCov);
      _.forEach(excludedAlternatives, function (excludedAlternativeId) {
        var idx = newCov.colnames.indexOf(excludedAlternativeId);
        newCov.colnames.splice(idx, 1);
        newCov.rownames.splice(idx, 1);
        newCov.data = reduceMatrix(newCov.data, idx);
      });
      return newCov;
    }

    function reduceMatrix(matrix, idx) {
      var newCov = _.cloneDeep(matrix);
      newCov.splice(idx, 1);
      _.forEach(newCov, function (row) {
        row = row.splice(idx, 1);
      });
      return newCov;
    }

    function reduceMu(mu, excludedAlternatives) {
      return _.reduce(
        mu,
        function (accum, muValue, key) {
          if (!_.includes(excludedAlternatives, key)) {
            accum[key] = muValue;
          }
          return accum;
        },
        {}
      );
    }

    function checkForMissingValuesInPerformanceTable(performanceTable) {
      return _.some(performanceTable, function (entry) {
        return (
          hasTextEffectWithoutDistribution(entry.performance) ||
          hasTextDistributionWithoutEffect(entry.performance) ||
          hasTextDistributionAndEffect(entry.performance)
        );
      });
    }

    function hasTextEffectWithoutDistribution(performance) {
      return (
        performance.effect &&
        performance.effect.type === 'empty' &&
        !performance.distribution
      );
    }

    function hasTextDistributionWithoutEffect(performance) {
      return (
        performance.distribution &&
        performance.distribution.type === 'empty' &&
        !performance.effect
      );
    }

    function hasTextDistributionAndEffect(performance) {
      return (
        performance.effect &&
        performance.effect.type === 'empty' &&
        performance.distribution &&
        performance.distribution.type === 'empty'
      );
    }

    return {
      buildAggregateState: buildAggregateState,
      checkForMissingValuesInPerformanceTable: checkForMissingValuesInPerformanceTable
    };
  };

  return dependencies.concat(WorkspaceService);
});

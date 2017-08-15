'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');

  var dependencies = ['ScalesService', 'sortCriteriaWithW'];

  var WorkspaceService = function(ScalesService, sortCriteriaWithW) {

    function buildValueTree(problem) {
      if (problem.valueTree) {
        return problem.valueTree;
      } else {
        return {
          'title': 'Overall value',
          'criteria': _.keys(problem.criteria)
        };
      }
    }

    function buildTheoreticalScales(problem) {
      return _.fromPairs(_.map(problem.criteria, function(val, key) {
        var scale = val.scale || [null, null];
        scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
        scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];
        return [key, scale];
      }));
    }

    function getObservedScales(scope, problem) {
      return ScalesService.getObservedScales(scope, problem);
    }

    function reduceProblem(problem) {
      var criteria = _.reduce(problem.criteria, function(accum, criterion, key) {
        accum[key] = _.pick(criterion, ['scale', 'pvf', 'title']);
        return accum;
      }, {});
      return {
        criteria: criteria
      };
    }

    function mergeBaseAndSubProblem(baseProblem, subProblemDefinition) {
      var newProblem = _.cloneDeep(baseProblem);
      if (subProblemDefinition.excludedCriteria) {
        newProblem.criteria = _.omit(newProblem.criteria, subProblemDefinition.excludedCriteria);
        newProblem.performanceTable = _.reject(newProblem.performanceTable, function(performanceEntry) {
          return _.includes(subProblemDefinition.excludedCriteria, performanceEntry.criterionUri) ||
            _.includes(subProblemDefinition.excludedCriteria, performanceEntry.criterion); // addis/mcda standalone difference
        });
      }

      if (subProblemDefinition.excludedAlternatives) { 
        newProblem.alternatives = _.reduce(newProblem.alternatives, function(accum, alternative, key) {
          if (!_.includes(subProblemDefinition.excludedAlternatives, key)) {
            accum[key] = alternative;
          }
          return accum;
        }, {});

        var names = subProblemDefinition.excludedAlternatives;
        // remove all exact entries that are excluded
        newProblem.performanceTable = _.reject(newProblem.performanceTable, function(performanceEntry) {
          return performanceEntry.performance.type === 'exact' && _.includes(names, performanceEntry.alternative);
        });
        // remove all relative entries that are excluded
        _.forEach(newProblem.performanceTable, function(performanceEntry) {
          if (performanceEntry.performance.type !== 'exact') {
            performanceEntry.performance.parameters.relative.cov =
              reduceCov(performanceEntry.performance.parameters.relative.cov, names);
            performanceEntry.performance.parameters.relative.mu = reduceMu(performanceEntry.performance.parameters.relative.mu,
              subProblemDefinition.excludedAlternatives);
          }
        });
      }

      newProblem.criteria = _.merge(newProblem.criteria, subProblemDefinition.ranges);
      return newProblem;
    }

    function reduceCov(oldCov, names) {
      var newCov = _.cloneDeep(oldCov);
      _.forEach(names, function(name) {
        var idx = newCov.colnames.indexOf(name);
        newCov.colnames.splice(idx, 1);
        newCov.rownames.splice(idx, 1);
        newCov.data = reduceMatrix(newCov.data, idx);
      });
      return newCov;
    }

    function reduceMatrix(cov, idx) {
      var newCov = _.cloneDeep(cov);
      newCov.splice(idx, 1);
      _.forEach(newCov, function(row) {
        row = row.splice(idx, 1);
      });
      return newCov;
    }

    function reduceMu(mu, excludedAlternatives) {
      return _.reduce(mu, function(accum, muValue, key) {
        if (!_.includes(excludedAlternatives, key)) {
          accum[key] = muValue;
        }
        return accum;
      }, {});
    }

    function buildAggregateState(baseProblem, subProblem, scenario) {
      var newState = _.merge({}, {
        problem: mergeBaseAndSubProblem(baseProblem, subProblem.definition)
      }, scenario.state);
      newState.problem.criteria = _.keyBy(sortCriteriaWithW(newState.problem.criteria), 'id');
      return newState;
    }

    function setDefaultObservedScales(problem, observedScales) {
      var newProblem = _.cloneDeep(problem);
      _.forEach(newProblem.criteria, function(criterion, key) {
        var scale = observedScales[key];
        if (!criterion.pvf || _.isEmpty(criterion.pvf.range)) {
          criterion.pvf = {
            range: getMinMax(scale)
          };
        }
      });
      return newProblem;
    }

    function getMinMax(scales) {
      var minimum = Infinity;
      var maximum = -Infinity;
      _.forEach(scales, function(scale) {
        _.forEach(scale, function(value) {
          if (value < minimum) {
            minimum = value;
          }
          if (value > maximum) {
            maximum = value;
          }
        });
      });
      return [minimum, maximum];
    }

    return {
      getObservedScales: getObservedScales,
      buildTheoreticalScales: buildTheoreticalScales,
      buildValueTree: buildValueTree,
      reduceProblem: reduceProblem,
      buildAggregateState: buildAggregateState,
      mergeBaseAndSubProblem: mergeBaseAndSubProblem,
      setDefaultObservedScales: setDefaultObservedScales
    };
  };

  return angular.module('elicit.workspaceService', []).service('WorkspaceService', dependencies.concat(WorkspaceService));
});
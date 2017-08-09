'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');

  var dependencies = ['ScalesService', 'sortCriteriaWithW'];

  var WorkspaceService = function(ScalesService, sortCriteriaWithW) {

    var buildValueTree = function(problem) {
      if (problem.valueTree) {
        return problem.valueTree;
      } else {
        return {
          'title': 'Overall value',
          'criteria': _.keys(problem.criteria)
        };
      }
    };

    var buildTheoreticalScales = function(problem) {
      return _.fromPairs(_.map(problem.criteria, function(val, key) {
        var scale = val.scale || [null, null];

        scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
        scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

        return [key, scale];
      }));
    };

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
        newProblem.alternatives = _.omit(newProblem.alternatives, subProblemDefinition.excludedAlternatives);
        var newPerformanceTable = [];
          var names = _.map(subProblemDefinition.excludedAlternatives, function(alternative) {
            return alternative.name;
          });
        for(var i=0;i<newProblem.performanceTable.length;++i){
          if(){

          }
        }

        newProblem.performanceTable = _.forEach(newProblem.performanceTable, function(performanceEntry) {

          performanceEntry.parameters.relative.cov.colnames = _.omitBy(performanceEntry.parameters.relative.cov.colnames, names);

          performanceEntry.parameters.relative.cov.rownames = _.omitBy(performanceEntry.parameters.relative.cov.rownames, names);
        });


        _.reject(newProblem.performanceTable, function(performanceEntry) {
          return _.includes(subProblemDefinition.excludedCriteria, performanceEntry.criterionUri) ||
            _.includes(subProblemDefinition.excludedCriteria, performanceEntry.criterion); // addis/mcda standalone difference
        });
      }


      newProblem.criteria = _.merge(newProblem.criteria, subProblemDefinition.ranges);
      return newProblem;
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
'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');

  var dependencies = ['ScalesService'];

  var WorkspaceService = function(ScalesService) {

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
      return _.object(_.map(problem.criteria, function(val, key) {
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
        accum[key] = _.pick(criterion, ['scale', 'pvf']);
        return accum;
      }, {});
      return {
        criteria: criteria,
        prefs: problem.prefs
      };
    }

    return {
      getObservedScales: getObservedScales,
      buildTheoreticalScales: buildTheoreticalScales,
      buildValueTree: buildValueTree,
      reduceProblem: reduceProblem
    };
  };

  return angular.module('elicit.workspaceService', []).service('WorkspaceService', dependencies.concat(WorkspaceService));
});

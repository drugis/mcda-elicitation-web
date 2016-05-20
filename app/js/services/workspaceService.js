'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');

  var dependencies = ['$http', 'PataviService'];

  var WorkspaceService = function($http, PataviService) {

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
      return $http.post('/patavi', _.extend(problem, {method: 'scales'})).then(function(result) {
        var uri = result.headers("Location");
        if (result.status === 201 && uri) {
          return uri.replace(/^https/, "wss") + '/updates'; // FIXME
        }
      }, function(error) {
        scope.$root.$broadcast('error', error);
      })
      .then(PataviService.listen)
      .then(
        function(result) {
          return result.results;
        },
        function(pataviError) {
          scope.$root.$broadcast('error', {
            type: 'patavi',
            message: pataviError.desc
          });
        });
    }

    return {
      getObservedScales: getObservedScales,
      buildTheoreticalScales: buildTheoreticalScales,
      buildValueTree: buildValueTree
    };
  };

  return angular.module('elicit.workspaceService', []).service('WorkspaceService', dependencies.concat(WorkspaceService));
});

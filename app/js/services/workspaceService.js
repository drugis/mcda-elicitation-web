'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');

  var dependencies = ['elicit.pataviService'];

  var WorkspaceService = function(MCDAPataviService) {

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

    function getObservedScales(problem) {
      return MCDAPataviService.run(_.extend(problem, {method: 'scales'})).then(function(result){
        console.log('MCDAPataviService.run succes');
        console.log('result = ' + JSON.stringify(result));
        return result.results;
      }, function(code, error){
        console.log('MCDAPataviService.run error');
      });
    }

    return {
      getObservedScales: getObservedScales,
      buildTheoreticalScales: buildTheoreticalScales,
      buildValueTree: buildValueTree
    };
  };

  return angular.module('elicit.workspaceService', dependencies).factory('WorkspaceService', WorkspaceService);
});

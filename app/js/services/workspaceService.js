'use strict';
define(['angular'],
  function(angular) {

    var dependencies = ['elicit.workspaceResource'];

    var WorkspaceService = function($q, WorkspaceResource, MCDAPataviService) {

      function addValueTree(problem) {
        var newProblem = angular.copy(problem);
        if (!newProblem.valueTree) {
          newProblem.valueTree = {
            'title': 'Overall value',
            'criteria': _.keys(problem.criteria)
          };
        }
        return newProblem;
      }

      function createWorkspace(problem) {
        var workspace = {
          title: problem.title,
          problem: addValueTree(problem)
        };

        return WorkspaceResource.save(workspace);
      }

      function prepareScales(problem) {
        var payload = _.extend(problem, {
          method: 'scales'
        });
        return MCDAPataviService.run(payload);
      }

      function getWorkspace($stateParams) {
        var deferred = $q.defer();

        WorkspaceResource.get($stateParams, function(workspace) {
          prepareScales(workspace.problem).then(function(results) {
            workspace.problem = addValueTree(workspace.problem);
            workspace._scales = results.results;
            deferred.resolve(workspace);
          });
        });

        return deferred.promise;
      }

      return {
        createWorkspace: createWorkspace,
        getWorkspace: getWorkspace
      };
    };

    return angular.module('elicit.workspaceService', dependencies).factory('WorkspaceService', WorkspaceService);
  });

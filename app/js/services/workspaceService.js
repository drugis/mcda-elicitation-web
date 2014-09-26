'use strict';
define(['angular'],
  function(angular) {

    var dependencies = ['elicit.workspaceResource'];

    var WorkspaceService = function(WorkspaceResource, MCDAPataviService) {

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

      return {
        addValueTree: addValueTree,
        createWorkspace: createWorkspace,
        prepareScales: prepareScales
      };
    };

    return angular.module('elicit.workspaceService', dependencies).factory('WorkspaceService', WorkspaceService);
  });
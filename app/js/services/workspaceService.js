'use strict';
define(['angular', 'underscore'], function(angular, _) {

  var dependencies = ['elicit.workspaceResource'];

  var WorkspaceService = function($q, WorkspaceResource, MCDAPataviService) {

    function valueTree(problem) {
      return {
        'title': 'Overall value',
        'criteria': _.keys(problem.criteria)
      };
    }

    function createWorkspace(problem) {
      var workspace = {
        title: problem.title,
        problem: problem
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

          /* The $$ properties are reserved for Angular's internal functionality.
             They get stripped when calling toJson (or resource.$save)
             We (ab)use this feature to store derived values in the workspace
           */
          workspace.$$valueTree = valueTree(workspace.problem);
          workspace.$$scales = results.results;
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

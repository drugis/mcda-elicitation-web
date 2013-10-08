define(['angular', 'underscore'], function(angular, _) {
  return angular.module('elicit.workspace', []).factory('Workspace', function() {
    var workspaces = [];

    var create = function(problem) {
      var id = _.uniqueId("workspace_");
      var workspace = { "problem" : problem, 
		        "id" : id };
      workspaces.push(workspace);
      return workspace;
    };

    var getById = function(id) {
      return _.find(workspaces, function(item) { return item.id === id; });
    };

    return { "create" : create,
	     "get" : getById};
  });
});

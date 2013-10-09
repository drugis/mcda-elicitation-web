define(['angular', 'underscore'], function(angular, _) {
  return angular.module('elicit.workspace', []).factory('Workspace', function() {
    var WORKSPACE_PREFIX = "workspace_";

    var create = function(problem) {
      var id = _.uniqueId(WORKSPACE_PREFIX);
      var workspace = { "problem" : problem, 
		        "id" : id };
      localStorage.setItem(id, angular.toJson(workspace));
      return workspace;
    };

    var getById = function(id) {
      return angular.fromJson(localStorage.getItem(id));
    };

    var save = function(id, data) {
      var current = getById(id);
      var extended = _.extend(current, data);
      localStorage.setItem(id, angular.toJson(extended));
      return extended;
    };
    
    return { "create" : create,
	     "get" : getById,
	     "save": save };

  });
});

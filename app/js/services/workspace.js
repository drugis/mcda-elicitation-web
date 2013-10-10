define(['angular', 'underscore', 'services/partialValueFunction'], function(angular, _) {
  return angular.module('elicit.workspace', ['elicit.pvfService']).factory('Workspace', function(PartialValueFunction) {
    var WORKSPACE_PREFIX = "workspace_";

    var create = function(problem) {
      var id = _.uniqueId(WORKSPACE_PREFIX);
      var workspace = { "problem" : problem,
                        "id" : id };
      localStorage.setItem(id, angular.toJson(workspace));
      return workspace;
    };

    var get = function(id) {
      var workspace = angular.fromJson(localStorage.getItem(id));
      PartialValueFunction.attach(workspace);
      return workspace;
    };

    var save = function(id, data) {
      var current = get(id);
      var extended = _.extend(current, data);
      localStorage.setItem(id, angular.toJson(extended));
      return extended;
    };

    return { "create" : create,
             "get" : get,
             "save": save };
  });
});

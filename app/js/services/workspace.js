define(['angular', 'underscore', 'services/partialValueFunction'], function(angular, _) {
  var dependencies = ['elicit.pvfService'];

  var Workspaces = function(PartialValueFunction, $routeParams, $rootScope)  {
    var WORKSPACE_PREFIX = "workspace_";

    function uniqueId(size, prefix) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < size; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    var save = function(id, data) {
      console.log("saving", id, data);
      var current = get(id);
      var extended = _.extend(current, data);
      localStorage.setItem(id, angular.toJson(extended));
      return extended;
    };

    var decorate = function(workspace) {
      if(workspace) {
        if(workspace.id) { workspace.save = _.partial(save, workspace.id); }
        if(workspace.state) { PartialValueFunction.attach(workspace.state); }
      }
      return workspace;
    };

    var get = function(id) {
      var workspace = angular.fromJson(localStorage.getItem(id));
      return decorate(workspace);
    };


    var create = function(problem) {
      var id = uniqueId(5, WORKSPACE_PREFIX);
      var workspace = { "state" : { problem: problem },
                        "id" : id,
                        "currentTask": null };
      localStorage.setItem(id, angular.toJson(workspace));
      return workspace;
    };

    /* Register watch for change in workspace */
    var scope = $rootScope.$new(true);
    var current = {};

    var setCurrent = function(id) {
      console.info("Switched to workspace", id);
      current = angular.copy(get(id), current);
    };

    scope.$watch(function() { return $routeParams; },
                 function(newVal) { setCurrent(newVal.workspaceId); }, true);

    return { "current": current,
             "create" : create,
             "get" : get,
             "save": save };
  };

  return angular.module('elicit.workspace', dependencies).factory('Workspaces', Workspaces);
});

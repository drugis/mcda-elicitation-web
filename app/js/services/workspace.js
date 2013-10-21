define(['angular', 'underscore', 'services/partialValueFunction'], function(angular, _) {
  var dependencies = ['elicit.pvfService'];

  var Workspaces = function(PartialValueFunction, $routeParams, $rootScope, $q)  {
    var WORKSPACE_PREFIX = "";

    function uniqueId(size, prefix) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < size; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    var save = function(id, data) {
      var fields = ['problem', 'prefs'];
      var toSave = { id: id, state : _.pick(data, fields) };
      console.log("saving", toSave);
      localStorage.setItem(id, angular.toJson(toSave));
      return toSave;
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
                        "id" : id };
      localStorage.setItem(id, angular.toJson(workspace));
      return workspace;
    };

    var scope = $rootScope.$new(true);

    var getCurrent = function() {
      var deferred = $q.defer();

      var resolver = function(newVal) {
        if(newVal && newVal.workspaceId) {
          deferred.resolve(get(newVal.workspaceId));
        }
      };

      scope.$watch(function() { return $routeParams; }, resolver, true);
      return deferred.promise;
    };

    return { "current": getCurrent,
             "create" : create,
             "get" : get,
             "save": save };
  };

  return angular.module('elicit.workspace', dependencies).factory('Workspaces', Workspaces);
});

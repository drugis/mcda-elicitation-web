define(['config', 'angular', 'underscore', 'services/partialValueFunction'], function(Config, angular, _) {
  var dependencies = ['elicit.pvfService'];

  var Workspaces = function(PartialValueFunction, $routeParams, $rootScope, $q, $location)  {
    function randomId(size, prefix) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < size; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    var save = function(id, workspace) {
      var toSave = { id: id, scenarios : workspace.scenarios };
      console.log("saving", toSave);
      localStorage.setItem(id, angular.toJson(toSave));
      return toSave;
    };

    var redirectToDefaultView = function(workspaceId, scenarioId) {
      var nextUrl = "/workspaces/" + workspaceId + "/scenarios/" + scenarioId + "/" + Config.defaultView;
      $location.path(nextUrl);
    };

    var scope = $rootScope.$new(true);

    var decorate = function(workspace) {
      workspace.redirectToDefaultView = _.partial(redirectToDefaultView, workspace.id, _.keys(workspace.scenarios)[0]);

      workspace.getScenario = function(id) {
        var deferred = $q.defer();

        var scenario  = workspace.scenarios[id];
        PartialValueFunction.attach(scenario.state);
        scenario.redirectToDefaultView = function() {
          redirectToDefaultView(workspace.id, id);
        };
        scenario.save = function(state) {
          var fields = ['problem', 'prefs'];
          workspace.scenarios[scenario.id] = { "id": scenario.id, "state": _.pick(state, fields) };
          save(workspace.id, workspace);
        };
        deferred.resolve(scenario);
        return deferred.promise;
      };

      workspace.currentScenario = function() {
        var deferred = $q.defer();
        var resolver = function(newVal, oldVal) {
          if(newVal && newVal.scenarioId) {
            var scenario = workspace.getScenario(newVal.scenarioId);
            scenario.then(function() { deferred.resolve(scenario); });
          }
        };
        scope.$watch(function() { return $routeParams; }, resolver, true);
        return deferred.promise;
      };

      return workspace;
    };

    var get = function(id) {
      var workspace = angular.fromJson(localStorage.getItem(id));
      return decorate(workspace);
    };

    var create = function(problem) {
      var workspaceId = randomId(5);
      var scenarioId = randomId(5);

      var scenarios = {};
      scenarios[scenarioId] = { "id" : scenarioId, "state": { problem: problem }};

      var workspace = { "scenarios": scenarios,
                        "id" : workspaceId };
      localStorage.setItem(workspaceId, angular.toJson(workspace));
      return decorate(workspace);
    };

    var getCurrent = function() {
      var deferred = $q.defer();
      var resolver = function(newVal, oldVal) {
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

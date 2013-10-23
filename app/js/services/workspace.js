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
      console.info("saving", workspace);
      localStorage.setItem(id, angular.toJson(workspace));
      $rootScope.$broadcast("elicit.scenariosChanged");
      return workspace;
    };

    var redirectToDefaultView = function(workspaceId, scenarioId) {
      console.info("redirecting to", workspaceId, scenarioId);
      var nextUrl = "/workspaces/" + workspaceId + "/scenarios/" + scenarioId + "/" + Config.defaultView;
      $location.path(nextUrl);
    };

    var scope = $rootScope.$new(true);

    var decorate = function(workspace) {
      workspace.redirectToDefaultView = function(scenarioId) {
        redirectToDefaultView(workspace.id, scenarioId ? scenarioId : _.keys(workspace.scenarios)[0]);
      };

      workspace.getScenario = function(id) {
        var deferred = $q.defer();
        var scenario  = workspace.scenarios[id];
        PartialValueFunction.attach(scenario.state);
        scenario.redirectToDefaultView = function() {
          redirectToDefaultView(workspace.id, id);
        };
        scenario.save = function() {
          save(workspace.id, workspace);
        };
        scenario.update = function(state) {
          var fields = ['problem', 'prefs'];
          scenario.state = _.pick(state, fields);
          scenario.save();
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

      workspace.newScenario = function(state) {
        var id = randomId(5);

        var n = _.size(workspace.scenarios) + 1;
        var scenario = { "id" : id, "title": "Scenario " + n, "state": state };
        workspace.scenarios[id] = scenario;

        save(workspace.id, workspace);

        return id;
      };

      workspace.query = function() {
        var scenarios = _.sortBy(_.values(workspace.scenarios), "title");
        return _.object(_.pluck(scenarios, "id"), _.pluck(scenarios, "title"));
      };

      return workspace;
    };

    var get = _.memoize(function(id) {
      var workspace = angular.fromJson(localStorage.getItem(id));
      return decorate(workspace);
    });

    var create = function(problem) {
      var workspaceId = randomId(5);
      var scenarioId = randomId(5);

      var scenarios = {};
      scenarios[scenarioId] = { "id" : scenarioId, "title": "Default", "state": { problem: problem }};

      var workspace = { "scenarios": scenarios,
                        "title": problem.title,
                        "problem": problem,
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

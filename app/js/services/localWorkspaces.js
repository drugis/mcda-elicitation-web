'use strict';
define(['mcda/config', 'angular', 'underscore', 'mcda/services/partialValueFunction'], function(Config, angular, _) {
  var dependencies = ['elicit.pvfService'];

  var Workspaces = function(PartialValueFunction, $rootScope, $q, $location)  {
    function randomId(size, prefix) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < size; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    var save = function(id, workspace) {
      localStorage.setItem('workspace.' + id, angular.toJson(workspace));
      $rootScope.$broadcast("elicit.scenariosChanged");
      return workspace;
    };

    var redirectToDefaultView = function(workspaceId, scenarioId) {
      var nextUrl = "/workspaces/" + workspaceId + "/scenarios/" + scenarioId + "/" + Config.defaultView;
      $location.path(nextUrl);
    };

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

        scenario.createPath = _.partial(Config.createPath, workspace.id, scenario.id);

        deferred.resolve(scenario);
        return deferred.promise;
      };

      workspace.newScenario = function(state) {
        var id = randomId(5);

        var n = _.size(workspace.scenarios) + 1;
        var scenario = { "id" : id, "title": "Scenario " + n, "state": state };
        workspace.scenarios[id] = scenario;

        save(workspace.id, workspace);

        var deferred = $q.defer();
        deferred.resolve(id);
        return deferred.promise;
      };
      
      workspace.$save = function() {
        save(workspace.id, workspace);  
      };

      workspace.query = function() {
        return _.values(workspace.scenarios).sort(function(a, b) { return a.title.localeCompare(b.title); });
      };

      return workspace;
    };

    var get = function(id) {
      var deferred = $q.defer();
      var workspace = angular.fromJson(localStorage.getItem('workspace.' + id));
      deferred.resolve(decorate(workspace));
      return deferred.promise;
    };

    var create = function(problem) {
      var workspaceId = randomId(5);
      var scenarioId = randomId(5);

      var scenarios = {};
      scenarios[scenarioId] = { "id" : scenarioId, "title": "Default", "state": { problem: problem }};

      var workspace = { "id" : workspaceId,
                        "defaultScenarioId": scenarioId,
                        "title": problem.title,
                        "problem": problem,
                        "scenarios": scenarios };
      localStorage.setItem('workspace.' + workspaceId, angular.toJson(workspace));
      
      var deferred = $q.defer();
      deferred.resolve(decorate(workspace));
      return deferred.promise;
    };

    var query = function() {
      var items = [];

      for (var key in localStorage) {
        if (key.match(/^workspace\./)) {
          var workspace = angular.fromJson(localStorage.getItem(key));
          items.push(workspace);
        }
      }

      return items;
    };

    return { "create" : create,
             "get" : get,
             "save": save,
             "query": query };
  };

  return angular.module('elicit.localWorkspaces', dependencies).factory('LocalWorkspaces', Workspaces);
});

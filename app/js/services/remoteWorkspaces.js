'use strict';
define(['config', 'angular', 'angular-resource', 'underscore', 'services/partialValueFunction'], function(Config, angular, angularResource, _) {
  var dependencies = ['elicit.pvfService', 'ngResource'];
  
  function randomId(size, prefix) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < size; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return prefix ? prefix + text : text;
  }

  var Workspaces = function(PartialValueFunction, $resource, $rootScope, $q, $location) {	
    var csrfToken = config.workspacesRepository._csrf_token;
    var csrfHeader = config.workspacesRepository._csrf_header;
    var headers = {};
    headers[csrfHeader] = csrfToken;
    var repositoryUrl = config.workspacesRepository.url;

    var WorkspaceResource = $resource(repositoryUrl + ":workspaceId", {workspaceId: '@id'},
        {save: {method: "POST", headers: headers}});
    
    var redirectToDefaultView = function(workspaceId, scenarioId) {
      console.info("redirecting to", workspaceId, scenarioId);
      var nextUrl = "/workspaces/" + workspaceId + "/scenarios/" + scenarioId + "/" + Config.defaultView;
      $location.path(nextUrl);
    };

    var decorate = function(workspace) {
      var ScenarioResource = $resource(repositoryUrl + ":workspaceId/scenarios/:scenarioId",
          { workspaceId: workspace.id, scenarioId: '@id' },
          {save: {method: "POST", headers: headers}});
      
      workspace.redirectToDefaultView = function(scenarioId) {
        redirectToDefaultView(workspace.id, scenarioId ? scenarioId : _.keys(workspace.scenarios)[0]);
      };

      workspace.getScenario = function(id) {
        var deferred = $q.defer();
        ScenarioResource.get({ scenarioId: id }, function(scenario) {
          PartialValueFunction.attach(scenario.state);
          scenario.redirectToDefaultView = function() {
            redirectToDefaultView(workspace.id, id);
          };

          scenario.save = function() {
            return scenario.$save(function() { $rootScope.$broadcast("elicit.scenariosChanged"); });
          };
  
          scenario.update = function(state) {
            var fields = ['problem', 'prefs'];
            scenario.state = _.pick(state, fields);
            scenario.$save();
          };
  
          scenario.createPath = _.partial(Config.createPath, workspace.id, scenario.id);
          
          console.log(scenario);
  
          deferred.resolve(scenario);
        });
        return deferred.promise;
      };

      workspace.newScenario = function(state) {
        var deferred = $q.defer();
        
        var scenario = new ScenarioResource({"title" : randomId(3, "Scenario "), "state": state});
        scenario.$save(function(scenario) {
          deferred.resolve(scenario.id);
        });
        
        return deferred.promise;
      };

      workspace.query = function() {
        return ScenarioResource.query();
      };

      return workspace;
    };

    var get = _.memoize(function(id) {
      var deferred = $q.defer();
      console.log("Getting " + id);
      WorkspaceResource.get({workspaceId: id}, function(workspace) {
        deferred.resolve(decorate(workspace));
      });
      return deferred.promise;
    });

    var create = function(problem) {
      var deferred = $q.defer();
     
      var workspace = new WorkspaceResource({title: problem.title, problem: problem});
      workspace.$save(function(workspace) { 
        var Scenario = $resource(repositoryUrl + ":workspaceId/scenarios/:scenarioId",
            { workspaceId: workspace.id },
            { save: {method: "POST", headers: headers} });
        var scenario = new Scenario({"title" : "Default", "state": { problem: problem }});
        scenario.$save(function(scenario) {
          workspace.defaultScenarioId = scenario.id;
          console.log(workspace);
          workspace.$save(function() {
            workspace.scenarios = {};
            workspace.scenarios[scenario.id] = scenario;
            deferred.resolve(decorate(workspace));
          });
        });
      });
      
      return deferred.promise;
    };
    
    var query = function() {
      return WorkspaceResource.query();
    };

    return { "create" : create,
             "get" : get,
             "query": query };
  };

  return angular.module('elicit.remoteWorkspaces', dependencies).factory('RemoteWorkspaces', Workspaces);
});

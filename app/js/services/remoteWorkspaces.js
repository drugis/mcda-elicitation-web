define(['angular'],
  function(angular) {
    var dependencies = ['ngResource'];

    var Workspaces = function($resource) {
      // var csrfToken = config.workspacesRepository._csrf_token;
      // var csrfHeader = config.workspacesRepository._csrf_header;
      // var path = $location.path();
      // var headers = {};
      // headers[csrfHeader] = csrfToken;

      // var repositoryUrl;
      // if (path === '/choose-problem') {
      //   repositoryUrl = config.workspacesRepository.url;
      // } else {
      //   var workspaceName = $window.config.workspaceName || 'workspaces';
      //   path = $location.path();
      //   repositoryUrl = path.substr(0, path.lastIndexOf(workspaceName) + workspaceName.length + 1);
      // }

      var WorkspaceResource = $resource(config.workspacesRepositoryUrl + ':workspaceId', {
        workspaceId: '@id'
      });

      // var redirectToDefaultView = function(workspaceId, scenarioId) {
      //   $state.go(Config.defaultView, {
      //     workspaceId: workspaceId,
      //     scenarioId: scenarioId
      //   });
      // };

      // function addValueTree(problem) {
      //   if (!problem.valueTree) {
      //     problem.valueTree = {
      //       'title': 'Overall value',
      //       'criteria': _.keys(problem.criteria)
      //     };
      //   }
      // }

      // var decorate = function(workspace) {
      //   addValueTree(workspace.problem);

      //   var ScenarioResource = $resource(
      //     repositoryUrl + ':workspaceId/scenarios/:scenarioId', {
      //       workspaceId: workspace.id,
      //       scenarioId: '@id'
      //     }, {
      //       save: {
      //         method: 'POST',
      //         headers: headers
      //       }
      //     }
      //   );

      //   workspace.redirectToDefaultView = function(scenarioId) {
      //     if (scenarioId) {
      //       redirectToDefaultView(workspace.id, scenarioId);
      //     } else {
      //       redirectToDefaultView(workspace.id, workspace.defaultScenarioId);
      //     }
      //   };

      //   ScenarioResource.prototype.save = function() {
      //     return this.$save(function() {
      //       $rootScope.$broadcast('elicit.scenariosChanged');
      //     });
      //   };

      //   // update state in scenario
      //   ScenarioResource.prototype.update = function(state) {
      //     var fields = ['problem', 'prefs'];
      //     this.state = _.pick(state, fields);
      //     this.$save().then(function(scenario) {
      //       PartialValueFunction.attach(scenario.state);
      //     });
      //   };

      //   ScenarioResource.prototype.redirectToDefaultView = function() {
      //     redirectToDefaultView(this.workspace, this.id);
      //   };

      //   workspace.getScenario = function(id) {
      //     var deferred = $q.defer();
      //     ScenarioResource.get({
      //       scenarioId: id
      //     }, function(scenario) {
      //       PartialValueFunction.attach(scenario.state);
      //       deferred.resolve(scenario);
      //     });
      //     return deferred.promise;
      //   };

      //   workspace.newScenario = function(state) {
      //     var deferred = $q.defer();

      //     var scenario = new ScenarioResource({
      //       'title': randomId(3, 'Scenario '),
      //       'state': state
      //     });
      //     scenario.$save(function(scenario) {
      //       deferred.resolve(scenario.id);
      //     });

      //     return deferred.promise;
      //   };

      //   workspace.query = function() {
      //     return ScenarioResource.query(function(scenarios) {
      //       angular.forEach(scenarios, function(scenario) {
      //         PartialValueFunction.attach(scenario.state);
      //       });
      //     });
      //   };

      //   return workspace;
      // };

      // var get = function(id) {
      //   var deferred = $q.defer();
      //   WorkspaceResource.get({
      //     workspaceId: id
      //   }, function(workspace) {
      //     deferred.resolve(decorate(workspace));
      //   });
      //   return deferred.promise;
      // };

      // var create = function(problem) {
      //   var deferred = $q.defer();

      //   var workspace = new WorkspaceResource({
      //     title: problem.title,
      //     problem: problem
      //   });
      //   workspace.$save(function(workspace) {
      //     var Scenario = $resource(repositoryUrl + ':workspaceId/scenarios/:scenarioId', {
      //       workspaceId: workspace.id
      //     }, {
      //       save: {
      //         method: 'POST',
      //         headers: headers
      //       }
      //     });
      //     var scenario = new Scenario({
      //       'title': 'Default',
      //       'state': {
      //         problem: problem
      //       }
      //     });
      //     scenario.$save(function(scenario) {
      //       workspace.defaultScenarioId = scenario.id;
      //       workspace.$save(function() {
      //         workspace.scenarios = {};
      //         workspace.scenarios[scenario.id] = scenario;
      //         deferred.resolve(decorate(workspace));
      //       });
      //     });
      //   });

      //   return deferred.promise;
      // };

      // var query = function() {
      //   return WorkspaceResource.query();
      // };

      // return {
      //   'create': create,
      //   'get': get,
      //   'query': query
      // };
    };

    return angular.module('elicit.remoteWorkspaces', dependencies).factory('WorkspaceResource', Workspaces);
  });

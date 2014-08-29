'use strict';
define(
  ['angular',
'mcda/config',
   'angular-resource',
   'angular-ui-router',
    'mcda/controllers',
    'mcda/controllers',
    'mcda/directives',
    'mcda/filters',
    'mcda/services/remoteWorkspaces',
    'mcda/services/taskDependencies',
    'mcda/services/errorHandling',
    'mcda/services/hashCodeService'
   ],
  function(angular, Config) {
    var mcdaDependencies = [
      'elicit.remoteWorkspaces',
      'elicit.directives',
      'elicit.filters',
      'elicit.controllers',
      'elicit.taskDependencies',
      'elicit.errorHandling'
    ];

    var app = angular.module("temp", ['ui.router', 'ngResource'].concat(mcdaDependencies));
    app.constant('Tasks', Config.tasks);
    app.constant('DEFAULT_VIEW', 'overview');

    app.run(['$rootScope', function($rootScope) {
      $rootScope.$on('error', function(e, message) {
        $rootScope.$safeApply($rootScope, function() {
          $rootScope.error = _.extend(message, { close: function() { delete $rootScope.error; } });
        });
      });
    }]);

    app.config(function($stateProvider, $urlRouterProvider, Tasks) {
      $urlRouterProvider.otherwise('');
      var baseTemplatePath = 'bower_components/mcda-web/app/views/';

      //$httpProvider.interceptors.push('ErrorHandling');

      $stateProvider.state('root', {
        url: '',
        templateUrl: 'views/home.html',
        resolve: {
          user: function($q, $http) {
            var user = $q.defer();
            $http({method: 'GET', url: '/me'})
              .success(function(data) {
                user.resolve(data);
              })
              .error(function(error) {
                user.resolve(null);
              });
            return user.promise;
          }
        },
        controller: function($scope, $state, user) {
          $scope.user = user;
        }
      });
      $stateProvider.state("workspace", {
        parent: 'root',
        url: '/workspaces/:workspaceId',
        templateUrl: baseTemplatePath + 'workspace.html',
        resolve: {
          currentWorkspace: ["$stateParams", config.workspacesRepository.service, function($stateParams, Workspaces) {
            return Workspaces.get($stateParams.workspaceId);
          }]
        },
        controller: 'WorkspaceController',
        abstract: true
      })
      .state("workspace.scenario", {
        url: '/scenarios/:scenarioId',
        templateUrl: baseTemplatePath + 'scenario.html',
        resolve: {
          currentScenario: function($stateParams, currentWorkspace) {
            return currentWorkspace.getScenario($stateParams.scenarioId);
          }
        },
        controller: 'ScenarioController'
      });


      _.each(Tasks.available, function(task) {
        var templateUrl = baseTemplatePath + task.templateUrl;
        $stateProvider.state(task.id, {
          parent: 'workspace.scenario',
          url: '/' + task.id,
          templateUrl: templateUrl,
          controller: task.controller,
          resolve : {
            taskDefinition: function(currentScenario, TaskDependencies) {
              var def = TaskDependencies.extendTaskDefinition(task);
              return def;
            }
          }
        });
      });

      // Default route
      $stateProvider.state('choose-problem',
                           { parent: 'root',
                             url: '/choose-problem',
                             templateUrl: baseTemplatePath + 'chooseProblem.html',
                             controller: "ChooseProblemController" });
      $urlRouterProvider.otherwise('/choose-problem');

    });

    return app;
  });

'use strict';
define(
  ['angular',
   'require',
   'underscore',
   'jQuery',
   'NProgress',
   'config',
   'angular-ui-router',
   'services/localWorkspaces',
   'services/remoteWorkspaces',
   'services/taskDependencies',
   'services/errorHandling',
   'services/hashCodeService',
   'foundation',
   'controllers',
   'directives',
   'filters'],
  function(angular, require, _, $, NProgress, Config) {
    var dependencies = [
      'ui.router',
      'elicit.localWorkspaces',
      'elicit.remoteWorkspaces',
      'elicit.directives',
      'elicit.filters',
      'elicit.controllers',
      'elicit.taskDependencies',
      'elicit.errorHandling'];
    var app = angular.module('elicit', dependencies);

    app.run(['$rootScope', function($rootScope) {
      
      $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
      });

      // from http://stackoverflow.com/questions/16952244/what-is-the-best-way-to-close-a-dropdown-in-zurb-foundation-4-when-clicking-on-a
      $('.f-dropdown').click(function() {
        if ($(this).hasClass('open')) {
          $('[data-dropdown="'+$(this).attr('id')+'"]').trigger('click');
        }
      });

      $rootScope.$safeApply = function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          this.$eval(fn);
        }
        else {
          this.$apply(fn);
        }
      };
      $rootScope.$on('patavi.error', function(e, message) {
        $rootScope.$safeApply($rootScope, function() {
          $rootScope.error = _.extend(message, { close: function() { delete $rootScope.error; } });
        });
      });

      $rootScope.$on('$stateChangeStart', function(e, state) {
        $rootScope.inTransition = true;
        !$rootScope.noProgress && NProgress.start();
      });

      $rootScope.$on('$stateChangeSuccess', function(e, state) {
        $rootScope.inTransition = false;
        !$rootScope.noProgress && NProgress.done();
      });

      $rootScope.$on('$viewContentLoading', function(e, state) {
        NProgress.inc();
      });




    }]);
    app.constant('Tasks', Config.tasks);


    app.config(['Tasks', '$stateProvider', '$urlRouterProvider', '$httpProvider', function(Tasks, $stateProvider, $urlRouterProvider, $httpProvider) {
      var baseTemplatePath = "app/views/";
      
      $httpProvider.interceptors.push('ErrorHandling');
      
      NProgress.configure({ showSpinner: false });

      $stateProvider.state("workspace", {
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
                           { url: '/choose-problem',
                             templateUrl: baseTemplatePath + 'chooseProblem.html',
                             controller: "ChooseProblemController" });
      $urlRouterProvider.otherwise('/choose-problem');
    }]);

    return app;
  });

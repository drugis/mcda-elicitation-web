'use strict';
define(
  ['angular',
   'require',
   'underscore',
   'jQuery',
   'NProgress',
   'mcda/config',
   'foundation',
   'mmfoundation',
   'angular-ui-router',
   'angularanimate',
   'mcda/services/localRemarks',
   'mcda/services/localWorkspaces',
   'mcda/services/remoteRemarks',
   'mcda/services/remoteWorkspaces',
   'mcda/services/taskDependencies',
   'mcda/services/errorHandling',
   'mcda/services/hashCodeService',
   'mcda/services/util',
   'mcda/controllers',
   'mcda/directives'],
  function(angular, require, _, $, NProgress, Config) {
    var dependencies = [
      'ui.router',
      'mm.foundation',
      'ngAnimate',
      'elicit.localRemarks',
      'elicit.localWorkspaces',
      'elicit.remoteRemarks',
      'elicit.remoteWorkspaces',
      'elicit.util',
      'elicit.directives',
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
      $rootScope.$on('error', function(e, message) {
        $rootScope.$safeApply($rootScope, function() {
          $rootScope.error = _.extend(message, { close: function() { delete $rootScope.error; } });
        });
      });

    }]);
    app.constant('Tasks', Config.tasks);

    // Detect our location so we can get the templates from the correct place
    app.constant('mcdaRootPath', (function() {
      var scripts = document.getElementsByTagName("script");
      var pattern = /js\/mcda-web.js$/;
      for (var i = 0; i < scripts.length; ++i) {
        if ((scripts[i].src || "").match(pattern)) {
          return scripts[i].src.replace(pattern, '');
        }
      }
      throw "Failed to detect location for mcda-web.";
    })());


    app.config(['mcdaRootPath', 'Tasks', '$stateProvider', '$urlRouterProvider', '$httpProvider', function(basePath, Tasks, $stateProvider, $urlRouterProvider, $httpProvider) {
      var baseTemplatePath = basePath + "views/";
      
      $httpProvider.interceptors.push('ErrorHandling');
      
      NProgress.configure({ showSpinner: false });

        //ui-router code starts here
      $stateProvider.state("workspace", {
        url: '/workspaces/:workspaceId',
        templateUrl: baseTemplatePath + 'workspace.html',
        resolve: {
          currentWorkspace: ["$stateParams", config.workspacesRepository.type + 'Workspaces', function($stateParams, Workspaces) {
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
            controller: "ChooseProblemController"
        })
        ;

    $urlRouterProvider.otherwise('/choose-problem');
    }]);

    return app;
  });

'use strict';
define(['angular', 'mcda/config'],
  function(angular, Config) {

    var dependencies = [];

    var MCDARouteFactory = function($stateProvider) {

      function buildRoutes(parentState, baseTemplatePath) {

        $stateProvider.state(parentState + '.scenario', {
          url: '/scenarios/:scenarioId',
          templateUrl: baseTemplatePath + 'scenario.html',
          controller: 'ScenarioController'
        });

        angular.forEach(Config.tasks.available, function(task) {
          var templateUrl = baseTemplatePath + task.templateUrl;
          $stateProvider.state(task.id, {
            parent: parentState + '.scenario',
            url: '/' + task.id,
            templateUrl: templateUrl,
            controller: task.controller,
            resolve: {
              taskDefinition: function(currentScenario, TaskDependencies) {
                var def = TaskDependencies.extendTaskDefinition(task);
                return def;
              }
            }
          });
        });
      }

      return {
        buildRoutes: buildRoutes
      };
    };

    return angular.module('elicit.routeFactory', dependencies).factory('MCDARouteFactory', MCDARouteFactory);
  });
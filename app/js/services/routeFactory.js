'use strict';
define(['lodash', 'angular', '../config'], function(_, angular, Config) {
  var dependencies = [];

  var MCDARouteProvider = function() {
    return {
      buildRoutes: function($stateProvider, parentState) {

        var scenarioState = {
          name: parentState + '.scenario',
          url: '/problems/:problemId/scenarios/:id',
          templateUrl: '../benefitRisk/mcdaBenefitRisk.html',
          controller: 'MCDABenefitRiskController',
          resolve: {
            subProblems: function($stateParams, SubProblemResource) {
              return SubProblemResource.query(_.omit($stateParams, 'problemId')).$promise;
            },
            scenarios: function($stateParams, ScenarioResource) {
              return ScenarioResource.query(_.omit($stateParams, 'id')).$promise;
            },
            currentScenario: function($stateParams, ScenarioResource) {
              return ScenarioResource.get($stateParams).$promise;
            },
            currentSubProblem: function($stateParams, SubProblemResource) {
              return SubProblemResource.get(($stateParams)).$promise;
            }
          }
        };

        var children = Config.tasks.available.map(function(task) {
          var state = {
            name: task.id,
            parent: scenarioState,
            url: task.url ? task.url : '/' + task.id,
          };
          if (task.redirectTo) {
            state.redirectTo = task.redirectTo;
          } else {
            state.controller = task.controller;
            state.templateUrl = task.templateUrl;
            state.resolve = {
              currentScenario: function($stateParams, ScenarioResource) {
                return ScenarioResource.get($stateParams).$promise;
              },
              taskDefinition: function(TaskDependencies) {
                return TaskDependencies.extendTaskDefinition(task);
              }
            };
          }
          return state;
        });

        $stateProvider.state(scenarioState);
        children.forEach(function(child) {
          $stateProvider.state(child);
        });

      },
      $get: function() {}
    };
  };

  return angular.module('elicit.routeFactory', dependencies).provider('MCDARoute', MCDARouteProvider);
});

'use strict';
define(['angular', 'mcda/config'],
  function(angular, Config) {

    var dependencies = [];

    var MCDARouteProvider = function() {

      return {
        buildRoutes: function($stateProvider, parentState, baseTemplatePath) {

          $stateProvider.state(parentState + '.scenario', {
            url: '/scenarios/:scenarioId',
            templateUrl: baseTemplatePath + 'scenario.html',
            controller: 'ScenarioController',
            resolve: {
              currentScenario: ['$stateParams', 'ScenarioResource', 'PartialValueFunction',
                function($stateParams, ScenarioResource, PartialValueFunction) {
                  return ScenarioResource.get($stateParams, function(scenario) {
                    scenario.state = PartialValueFunction.attach(scenario.state);
                  }).$promise;
                }
              ]
            }
          });

          angular.forEach(Config.tasks.available, function(task) {
            var templateUrl = baseTemplatePath + task.templateUrl;
            $stateProvider.state(task.id, {
              parent: parentState + '.scenario',
              url: '/' + task.id,
              templateUrl: templateUrl,
              controller: task.controller,
              resolve: {
                taskDefinition: function(TaskDependencies) {
                  var def = TaskDependencies.extendTaskDefinition(task);
                  return def;
                }
              }
            });
          });
        },
        $get: function() {

        }
      };

    };

    return angular.module('elicit.routeFactory', dependencies).provider('MCDARoute', MCDARouteProvider);
  });

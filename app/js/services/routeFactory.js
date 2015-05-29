'use strict';
define(function(require) {
  var angular = require("angular");
  var Config = require("mcda/config");
  var _ = require("underscore");

  var dependencies = [];

  var MCDARouteProvider = function() {
    return {
      buildRoutes: function($stateProvider, parentState, baseTemplatePath) {

        var parent = {
          name: parentState + '.scenario',
          url: '/scenarios/:id',
          templateUrl: baseTemplatePath + 'scenario.html',
          controller: 'ScenarioController',
          resolve: {
            scenarios: function($stateParams, ScenarioResource) {
              return ScenarioResource.query(_.omit($stateParams, 'id')).$promise;
            }}
        };

        var children = Config.tasks.available.map(function(task) {
          var templateUrl = baseTemplatePath + task.templateUrl;
          return {
            name: task.id,
            parent: parent,
            url: task.url ? task.url : '/' + task.id,
            templateUrl: templateUrl,
            controller: task.controller,
            resolve: {
              currentScenario: function($stateParams, ScenarioResource) {
                return ScenarioResource.get($stateParams).$promise;
              },
              taskDefinition: function(TaskDependencies) {
                return TaskDependencies.extendTaskDefinition(task);
              }
            }
          };
        });

        $stateProvider.state(parent);
        children.forEach(function(child) {
          $stateProvider.state(child);
        });

      },
      $get: function() {}
    };
  };

  return angular.module('elicit.routeFactory', dependencies).provider('MCDARoute', MCDARouteProvider);
});

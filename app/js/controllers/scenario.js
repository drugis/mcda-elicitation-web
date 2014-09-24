'use strict';
define(['angular', 'underscore', 'mcda/config'], function(angular, _, Config) {
  return function($scope, $location, $state, $stateParams, Tasks, TaskDependencies, ScenarioResource) {

    function randomId(size, prefix) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.scenario = {}; // necessary to prevent empty select option  http://stackoverflow.com/questions/12654631/why-does-angularjs-include-an-empty-option-in-select
    $scope.scenarios = ScenarioResource.query({
      workspaceId: $stateParams.workspaceId
    }, function(scenarios) {
      $scope.scenario = _.find(scenarios, function(scenario) {
        return scenario.id == $state.params.scenarioId;
      });
      $scope.resultsAccessible = resultsAccessible($scope.tasks.results, $scope.scenario.state);
    });

    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

    var resultsAccessible = function(results, state) {
      var accessible = TaskDependencies.isAccessible(results, state);
      return accessible.accessible;
    };


    $scope.$on('elicit.scenariosChanged', function() {
      $scope.scenarios = ScenarioResource.query($stateParams);
      $scope.resultsAccessible = resultsAccessible($scope.tasks.results, $scope.scenario.state);
    });

    var redirect = function(scenarioId) {
      $state.go(Config.defaultView, {
        workspaceId: $scope.workspace.id,
        scenarioId: scenarioId
      });
    };

    $scope.forkScenario = function() {
      var newScenario = {
        'title': randomId(3, 'Scenario '),
        'state': $scope.scenario.state
      };
      ScenarioResource.save({
        workspaceId: $scope.workspace.id
      }, newScenario, function(savedScenario) {
        redirect(savedScenario.id);
      });
    };

    $scope.newScenario = function() {
      var newScenario = {
        'title': randomId(3, 'Scenario '),
        'state': {
          'problem': $scope.workspace.problem
        }
      };
      ScenarioResource.save({
        workspaceId: $scope.workspace.id
      }, newScenario, function(savedScenario) {
        redirect(savedScenario.id);
      });
    };

    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
      $scope.scenarioTitle.value = $scope.scenario.title;
    };

    $scope.saveTitle = function() {
      $scope.scenario.title = $scope.scenarioTitle.value;
      $scope.scenario.save();
      $scope.isEditTitleVisible = false;
    };

    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };

    $scope.scenarioChanged = function(newScenario) {
      $state.go($scope.taskId, {
        workspaceId: $scope.workspace.id,
        scenarioId: newScenario.id
      });
    };
  };
});

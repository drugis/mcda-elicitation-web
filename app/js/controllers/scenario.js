'use strict';
define(['angular', 'underscore', 'mcda/config'], function(angular, _, Config) {
  return function($scope, $location, $state, $stateParams, Tasks, TaskDependencies, currentScenario, scenarios, ScenarioResource) {

    function randomId(size, prefix) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    var resultsAccessible = function(results, state) {
      return TaskDependencies.isAccessible(results, state);
    };

    $scope.scenario = currentScenario;
    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});
    $scope.resultsAccessible = resultsAccessible($scope.tasks.results, $scope.scenario.state);

    $scope.$on('elicit.partialValueFunctionChanged', function() {
      $scope.resultsAccessible = resultsAccessible($scope.tasks.results, $scope.scenario.state);
    });

    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.scenarios = scenarios;

    $scope.$on('elicit.scenariosChanged', function() {
      $scope.resultsAccessible = resultsAccessible($scope.tasks.results, $scope.scenario.state);
    });

    var redirect = function(scenarioId) {
      var newState = _.omit($stateParams, 'id');
      newState.id = scenarioId;
      $state.go(Config.defaultView, newState);
    };

    $scope.forkScenario = function() {
      var newScenario = {
        'title': randomId(3, 'Scenario '),
        'state': $scope.scenario.state
      };
      ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
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
      ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
        redirect(savedScenario.id);
      });
    };

    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
      $scope.scenarioTitle.value = $scope.scenario.title;
    };

    $scope.saveTitle = function() {
      $scope.scenario.title = $scope.scenarioTitle.value;
      $scope.scenario.$save($stateParams, function(){
        $scope.scenarios = ScenarioResource.query(_.omit($stateParams, 'id'))
      });
      $scope.isEditTitleVisible = false;
    };

    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };

    $scope.scenarioChanged = function(newScenario) {
      if (!resultsAccessible($scope.tasks.results, newScenario.state).accessible) {
        $scope.taskId = 'preferences';
      }
      $state.go($scope.taskId, {
        workspaceId: $scope.workspace.id,
        id: newScenario.id
      });
    };
  };
});
'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");
  var Config = require("mcda/config");

  return function($scope, $location, $state, $stateParams, Tasks, TaskDependencies, scenarios, ScenarioResource) {

    function randomId(size, prefix) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    var setResultsAccessible = function(state) {
      if(!state || !state.problem) {
        $scope.resultsAccessible = false;
        return;
      }
      $scope.resultsAccessible =
            TaskDependencies.isAccessible($scope.tasks.results, state);
    };

    $scope.$watch("__scenario.state", setResultsAccessible);
    $scope.$on("elicit.resultsAccessible", function(e, scenario) {
      setResultsAccessible(scenario.state);
    });
    $scope.__scenario = ScenarioResource.get($stateParams);

    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.scenarios = scenarios;

    var redirect = function(scenarioId) {
      var newState = _.omit($stateParams, 'id');
      newState.id = scenarioId;
      $state.go($state.current.name, newState, { reload: true });
    };

    $scope.forkScenario = function() {
      var newScenario = {
        'title': randomId(3, 'Scenario '),
        'state': $scope.__scenario.state
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
      $scope.scenarioTitle.value = $scope.__scenario.title;
    };

    $scope.saveTitle = function() {
      $scope.__scenario.title = $scope.scenarioTitle.value;
      $scope.isEditTitleVisible = false;
      $scope.__scenario.$save($stateParams, function(){
        $scope.scenarios = ScenarioResource.query(_.omit($stateParams, 'id'));
        redirect($stateParams.id);
      });
    };

    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };

    $scope.scenarioChanged = function(newScenario) {
      $state.go($state.current.name, {
        workspaceId: $scope.workspace.id,
        id: newScenario.id
      });
    };
  };
});

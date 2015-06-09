'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');
  var Config = require('mcda/config');

  return function($scope, $location, $state, $stateParams, Tasks, TaskDependencies, scenarios, ScenarioResource, WorkspaceService) {

    $scope.$watch('__scenario.state', function(state) {
      $scope.resultsAccessible = TaskDependencies.isAccessible($scope.tasks.results, state);
    });
    $scope.$on('elicit.resultsAccessible', function(event, scenario) {
      $scope.resultsAccessible = TaskDependencies.isAccessible($scope.tasks.results, scenario.state);
    });

    var currentProblem = $scope.workspace.problem;
    $scope.workspace.$$valueTree = WorkspaceService.buildValueTree(currentProblem);
    $scope.workspace.$$scales = {};
    $scope.workspace.$$scales.theoreticalScales = WorkspaceService.buildTheoreticalScales(currentProblem);

    WorkspaceService.getObservedScales(currentProblem).then(function(observedScales) {
      $scope.workspace.$$scales.observed = observedScales;
    });

    ScenarioResource.get($stateParams).$promise.then(function(result) {
      $scope.__scenario = result;
    });

    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.scenarios = scenarios;

    function randomId(size, prefix) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }


    function redirect(scenarioId) {
      var newState = _.omit($stateParams, 'id');
      newState.id = scenarioId;
      $state.go($state.current.name, newState, {
        reload: true
      });
    }

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
      $scope.__scenario.$save($stateParams, function() {
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

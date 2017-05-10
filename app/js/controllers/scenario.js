'use strict';
define(function(require) {
  var _ = require('lodash');
  var dependencies = ['$scope', '$location', '$state', '$stateParams', 'Tasks', 'TaskDependencies', 'scenarios',
    'ScenarioResource', 'SubProblemResource', 'WorkspaceService'
  ];

  function ScenarioController($scope, $location, $state, $stateParams, Tasks, TaskDependencies, scenarios,
    ScenarioResource, SubProblemResource, WorkspaceService) {

    var currentProblem = $scope.workspace.problem;

    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.scenarios = scenarios;
    $scope.workspace.$$valueTree = WorkspaceService.buildValueTree(currentProblem);
    $scope.workspace.$$scales = {};
    $scope.workspace.$$scales.theoreticalScales = WorkspaceService.buildTheoreticalScales(currentProblem);

    // functions
    $scope.forkScenario = forkScenario;
    $scope.newScenario = newScenario;
    $scope.editTitle = editTitle;
    $scope.saveTitle = saveTitle;
    $scope.cancelTitle = cancelTitle;
    $scope.scenarioChanged = scenarioChanged;

    function getTask(taskId) {
      return _.find(Tasks.available, function(task) {
        return task.id === taskId;
      });
    }

    function determineActiveTab() {
      var path = $location.path();
      var activeStateName = path.substr(path.lastIndexOf('/') + 1);
      var activeTask = getTask(activeStateName);
      if (activeTask) {
        $scope.activeTab = activeTask.activeTab;
      } else {
        $scope.activeTab = 'evidence';
      }
    }
    determineActiveTab();

    $scope.$watch('__scenario.state', function(state) {
      $scope.resultsAccessible = TaskDependencies.isAccessible($scope.tasks.results, state);
    });
    $scope.$on('elicit.resultsAccessible', function(event, scenario) {
      $scope.resultsAccessible = TaskDependencies.isAccessible($scope.tasks.results, scenario.state);
    });

    $scope.$on('$stateChangeStart', function(event, toState) {
      var task = getTask(toState.name);
      if (task && task.activeTab) {
        $scope.activeTab = task.activeTab;
      } else {
        $scope.activeTab = toState.name;
      }
    });

    WorkspaceService.getObservedScales($scope, currentProblem).then(function(observedScales) {
      $scope.workspace.$$scales.observed = observedScales;
    });

    $scope.subProblemPromise = SubProblemResource.get(_.extend({
      problemId: $stateParams.id
    }, $stateParams)).$promise.then(function(result) {
      $scope.subProblem = result;
      return result;
    });

    ScenarioResource.get($stateParams).$promise.then(function(result) {
      $scope.__scenario = result;
    });

    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

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

    function forkScenario() {
      ScenarioResource.get($stateParams, function(scenario) { // reload because child scopes may have changed scenario
        var newScenario = {
          'title': randomId(3, 'Scenario '),
          'state': scenario.state
        };
        ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
          redirect(savedScenario.id);
        });
      });
    }

    function newScenario() {

      var newScenario = {
        'title': randomId(3, 'Scenario '),
        'state': {
          'problem': WorkspaceService.reduceProblem($scope.workspace.problem)
        },
        workspace: $scope.workspace.id,
        subProblemId: $scope.subProblem.id
      };
      ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
        redirect(savedScenario.id);
      });
    }

    function editTitle() {
      $scope.isEditTitleVisible = true;
      $scope.scenarioTitle.value = $scope.__scenario.title;
    }

    function saveTitle() {
      $scope.__scenario.title = $scope.scenarioTitle.value;
      $scope.isEditTitleVisible = false;
      $scope.__scenario.$save($stateParams, function() {
        $scope.scenarios = ScenarioResource.query(_.omit($stateParams, 'id'));
        redirect($stateParams.id);
      });
    }

    function cancelTitle() {
      $scope.isEditTitleVisible = false;
    }

    function scenarioChanged(newScenario) {
      if (!newScenario) {
        return; // just a title edit
      }
      $state.go($state.current.name, {
        workspaceId: $scope.workspace.id,
        id: newScenario.id
      });
    }
  }
  return dependencies.concat(ScenarioController);
});

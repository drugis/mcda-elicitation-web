'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$transitions', '$state', '$stateParams', 'Tasks', 'TaskDependencies',
    'ScenarioResource', 'WorkspaceService', 'subProblems', 'currentSubProblem', 'scenarios', 'currentScenario'
  ];

  function MCDABenefitRiskController($scope, $transitions, $state, $stateParams, Tasks, TaskDependencies,
    ScenarioResource, WorkspaceService, subProblems, currentSubProblem, scenarios, currentScenario) {
    // functions
    $scope.forkScenario = forkScenario;
    $scope.newScenario = newScenario;
    $scope.scenarioChanged = scenarioChanged;
    
    // init
    var baseProblem = $scope.workspace.problem;
    var deregisterTransitionListener;
    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.selections = {};
    $scope.scenarios = scenarios;
    $scope.scenariosWithResults = WorkspaceService.filterScenariosWithResults(baseProblem, currentSubProblem, scenarios);
    $scope.scenario = currentScenario;
    $scope.isDuplicateScenarioTitle = false;
    $scope.aggregateState = WorkspaceService.buildAggregateState(baseProblem, currentSubProblem, currentScenario);
    $scope.subProblems = subProblems;
    $scope.subProblem = currentSubProblem;
    $scope.workspace.$$valueTree = WorkspaceService.buildValueTree(baseProblem);
    $scope.workspace.scales = {};
    $scope.workspace.scales.theoreticalScales = WorkspaceService.buildTheoreticalScales(baseProblem);
    determineActiveTab();

    $scope.$on('$destroy', deregisterTransitionListener);

    $scope.$watch('scenario.state', updateTaskAccessibility);
    $scope.$on('elicit.resultsAccessible', function(event, scenario) {
      $scope.aggregateState = WorkspaceService.buildAggregateState(baseProblem, currentSubProblem, scenario);
      $scope.scenario = scenario;
      if ($scope.workspace.scales.observed) {
        $scope.aggregateState.problem = WorkspaceService.setDefaultObservedScales($scope.aggregateState.problem, $scope.workspace.scales.observed);
      }
      updateTaskAccessibility();
    });

    $scope.scalesPromise = WorkspaceService.getObservedScales($scope, baseProblem).then(function(observedScales) {
      $scope.workspace.scales.observed = observedScales;
      $scope.aggregateState.problem = WorkspaceService.setDefaultObservedScales($scope.aggregateState.problem, observedScales);
      updateTaskAccessibility();
      return $scope.workspace.scales;
    });

    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

    deregisterTransitionListener = $transitions.onStart({}, function(transition) {
      setActiveTab(transition.to().name, transition.to().name);
    });

    function getTask(taskId) {
      return _.find(Tasks.available, function(task) {
        return task.id === taskId;
      });
    }

    function determineActiveTab() {
      setActiveTab($state.current.name, 'evidence');
    }

    function setActiveTab(activeStateName, defaultStateName) {
      var activeTask = getTask(activeStateName);
      if (activeTask) {
        $scope.activeTab = activeTask.activeTab;
      } else {
        $scope.activeTab = defaultStateName;
      }
    }

    function updateTaskAccessibility() {
      $scope.tasksAccessibility = {
        preferences: TaskDependencies.isAccessible($scope.tasks.preferences, $scope.aggregateState).accessible,
        results: TaskDependencies.isAccessible($scope.tasks.results, $scope.aggregateState).accessible
      };
    }

    function randomId(size, prefix) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return prefix ? prefix + text : text;
    }

    function redirect(scenarioId, stateName) {
      var newState = _.omit($stateParams, 'id');
      newState.id = scenarioId;
      $state.go(stateName, newState, {
        reload: true
      });
    }

    function forkScenario() {
      ScenarioResource.get($stateParams, function(scenario) { // reload because child scopes may have changed scenario
        var newScenario = {
          title: randomId(3, 'Scenario '),
          state: scenario.state,
          subProblemId: $scope.subProblem.id
        };
        ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
          redirect(savedScenario.id, $state.current.name);
        });
      });
    }

    function newScenario() {
      var mergedProblem = WorkspaceService.mergeBaseAndSubProblem($scope.workspace.problem, $scope.subProblem.definition);
      var newScenario = {
        title: randomId(3, 'Scenario '),
        state: {
          problem: WorkspaceService.reduceProblem(mergedProblem)
        },
        workspace: $scope.workspace.id,
        subProblemId: $scope.subProblem.id
      };
      ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
        var newStateName = $scope.tasksAccessibility.preferences ? 'preferences' : 'problem';
        redirect(savedScenario.id, newStateName);
      });
    }

    function scenarioChanged(newScenario) {
      if (!newScenario) {
        return; // just a title edit
      } else {
        if ($state.current.name === 'smaa-results') {

          $state.go('smaa-results', {
            workspaceId: $scope.workspace.id,
            problemId: $scope.subProblem.id,
            id: newScenario.id
          });
        } else if ($state.current.name === 'deterministic-results') {
          $state.go('deterministic-results', {
            workspaceId: $scope.workspace.id,
            problemId: $scope.subProblem.id,
            id: newScenario.id
          });
        } else {
          $state.go('preferences', {
            workspaceId: $scope.workspace.id,
            problemId: $scope.subProblem.id,
            id: newScenario.id
          });
        }
      }
    }
  }
  return dependencies.concat(MCDABenefitRiskController);
});
'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$transitions', '$state', '$stateParams', '$modal',
    'Tasks',
    'TaskDependencies',
    'ScenarioResource',
    'WorkspaceService',
    'WorkspaceSettingsService',
    'EffectsTableService',
    'subProblems',
    'currentSubProblem',
    'scenarios',
    'currentScenario',
    'isMcdaStandalone'
  ];

  function MCDABenefitRiskController($scope, $transitions, $state, $stateParams, $modal,
    Tasks,
    TaskDependencies,
    ScenarioResource,
    WorkspaceService,
    WorkspaceSettingsService,
    EffectsTableService,
    subProblems,
    currentSubProblem,
    scenarios,
    currentScenario,
    isMcdaStandalone
  ) {
    // functions
    $scope.forkScenario = forkScenario;
    $scope.newScenario = newScenario;
    $scope.scenarioChanged = scenarioChanged;
    $scope.updateScales = updateScales;

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

    $scope.baseAggregateState = WorkspaceService.buildAggregateState(baseProblem, currentSubProblem, currentScenario);
    var baseCriteria = $scope.baseAggregateState.problem.criteria;
    updateAggregateState();
    $scope.effectsTableInfo = EffectsTableService.createEffectsTableInfo(baseProblem.performanceTable);
    $scope.hasMissingValues = _.find($scope.aggregateState.problem.performanceTable, function(tableEntry) {
      return tableEntry.performance.type === 'empty';
    });
    checkHasNoStochasticResults();

    $scope.subProblems = subProblems;
    $scope.subProblem = currentSubProblem;
    $scope.workspace.scales = {};
    $scope.isStandalone = isMcdaStandalone;
    determineActiveTab();
    $scope.scalesPromise = WorkspaceService.getObservedScales(baseProblem).then(function(observedScales) {
      $scope.workspace.scales.base = observedScales;
      $scope.workspace.scales.basePercentified = WorkspaceService.percentifyScales(baseProblem.criteria, observedScales);
      updateScales(observedScales);
    });

    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

    deregisterTransitionListener = $transitions.onStart({}, function(transition) {
      setActiveTab(transition.to().name, transition.to().name);
    });

    $scope.$watch('scenario.state', updateTaskAccessibility);
    $scope.$watch('aggregateState', checkHasNoStochasticResults, true);
    $scope.$on('$destroy', deregisterTransitionListener);
    $scope.$on('elicit.settingsChanged', function() {
      updateScales($scope.workspace.scales.base);
    });
    $scope.$on('elicit.resultsAccessible', function(event, scenario) {
      $scope.baseAggregateState = WorkspaceService.buildAggregateState(baseProblem, currentSubProblem, scenario);
      baseCriteria = $scope.baseAggregateState.problem.criteria;

      updateAggregateState();
      $scope.scenario = scenario;
      if ($scope.workspace.scales.observed) {
        $scope.aggregateState.problem = WorkspaceService.setDefaultObservedScales(
          $scope.aggregateState.problem, $scope.workspace.scales.observed);
        $scope.baseAggregateState.problem = WorkspaceService.setDefaultObservedScales(
          $scope.baseAggregateState.problem, $scope.workspace.scales.base);
      }
      updateTaskAccessibility();
      checkHasNoStochasticResults();
      ScenarioResource.query(_.omit($stateParams, ['id'])).$promise.then(function(scenarios) {
        $scope.scenarios = scenarios;
        $scope.scenariosWithResults = WorkspaceService.filterScenariosWithResults(baseProblem, currentSubProblem, scenarios);
      });
    });

    function checkHasNoStochasticResults() {
      $scope.hasNoStochasticResults = WorkspaceService.hasNoStochasticResults($scope.aggregateState);
    }

    function updateAggregateState() {
      var aggregateState = _.merge({}, $scope.baseAggregateState, {
        problem: {
          criteria: WorkspaceSettingsService.usePercentage() ?
            WorkspaceService.percentifyCriteria($scope.baseAggregateState.problem.criteria) :
            $scope.baseAggregateState.problem.criteria
        }
      });
      $scope.aggregateState = aggregateState;
    }

    function updateScales(baseObservedScales) {
      updateAggregateState();
      if (WorkspaceSettingsService.usePercentage()) {
        $scope.workspace.scales.observed = WorkspaceService.percentifyScales(baseCriteria, baseObservedScales);
      } else {
        $scope.workspace.scales.observed = baseObservedScales;
      }
      $scope.baseAggregateState.problem = WorkspaceService.setDefaultObservedScales(
        $scope.baseAggregateState.problem, $scope.workspace.scales.base);
      $scope.aggregateState.problem = WorkspaceService.setDefaultObservedScales(
        $scope.aggregateState.problem, $scope.workspace.scales.observed);
      updateTaskAccessibility();
    }

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

    function redirect(scenarioId, stateName) {
      var newState = _.omit($stateParams, 'id');
      newState.id = scenarioId;
      $state.go(stateName, newState, {
        reload: true
      });
    }

    function forkScenario() {
      $modal.open({
        templateUrl: '../preferences/newScenario.html',
        controller: 'NewScenarioController',
        resolve: {
          scenarios: function() {
            return $scope.scenarios;
          },
          type: function() {
            return 'Fork';
          },
          callback: function() {
            return function(newTitle) {
              ScenarioResource.get($stateParams, function(scenario) { // reload because child scopes may have changed scenario
                var newScenario = {
                  title: newTitle,
                  state: scenario.state,
                  subProblemId: $scope.subProblem.id
                };
                ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
                  redirect(savedScenario.id, $state.current.name);
                });
              });
            };
          }
        }
      });
    }

    function newScenario() {
      $modal.open({
        templateUrl: '../preferences/newScenario.html',
        controller: 'NewScenarioController',
        resolve: {
          scenarios: function() {
            return $scope.scenarios;
          },
          type: function() {
            return 'New';
          },
          callback: function() {
            return function(newTitle) {
              var mergedProblem = WorkspaceService.mergeBaseAndSubProblem($scope.workspace.problem, $scope.subProblem.definition);
              var newScenario = {
                title: newTitle,
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
            };
          }
        }
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

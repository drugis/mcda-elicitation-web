'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$transitions', '$state', '$stateParams', '$modal',
    'BenefitRiskService',
    'Tasks',
    'TaskDependencies',
    'ScenarioResource',
    'WorkspaceService',
    'WorkspaceSettingsService',
    'EffectsTableService',
    'subProblems',
    'currentSubProblem',
    'currentScenario',
    'isMcdaStandalone'
  ];

  function MCDABenefitRiskController($scope, $transitions, $state, $stateParams, $modal,
    BenefitRiskService,
    Tasks,
    TaskDependencies,
    ScenarioResource,
    WorkspaceService,
    WorkspaceSettingsService,
    EffectsTableService,
    subProblems,
    currentSubProblem,
    currentScenario,
    isMcdaStandalone
  ) {
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
    $scope.scenario = currentScenario;
    $scope.isDuplicateScenarioTitle = false;
    updateScenarios();

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
      updateScenarios();
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
      $scope.workspace.scales.observed = WorkspaceSettingsService.usePercentage() ?
        WorkspaceService.percentifyScales(baseCriteria, baseObservedScales) : baseObservedScales;

      $scope.baseAggregateState = addScales($scope.baseAggregateState, $scope.workspace.scales.base);
      $scope.aggregateState = addScales($scope.aggregateState, $scope.workspace.scales.observed);
      updateTaskAccessibility();
    }

    function addScales(state, scales) {
      return _.merge({}, state, {
        problem: WorkspaceService.setDefaultObservedScales(state.problem, scales)
      });
    }

    function updateScenarios() {
      ScenarioResource.query(_.omit($stateParams, ['id'])).$promise.then(function(scenarios) {
        $scope.scenarios = scenarios;
        $scope.scenariosWithResults = WorkspaceService.filterScenariosWithResults(baseProblem, currentSubProblem, scenarios);
      });
    }

    function findAvailableTask(taskId) {
      return _.find(Tasks.available, function(task) {
        return task.id === taskId;
      });
    }

    function determineActiveTab() {
      setActiveTab($state.current.name, 'evidence');
    }

    function setActiveTab(activeStateName, defaultStateName) {
      var task = findAvailableTask(activeStateName);
      $scope.activeTab = task ? task.activeTab : defaultStateName;
    }

    function updateTaskAccessibility() {
      $scope.tasksAccessibility = {
        preferences: TaskDependencies.isAccessible($scope.tasks.preferences, $scope.aggregateState).accessible,
        results: TaskDependencies.isAccessible($scope.tasks.results, $scope.aggregateState).accessible
      };
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
            return (newTitle) => {
              BenefitRiskService.scenarioForked(newTitle, $scope.subProblem);
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
            return (newTitle) => {
              BenefitRiskService.newScenarioAndGo(newTitle, $scope.workspace, $scope.subProblem);
            };
          }
        }
      });
    }

    function scenarioChanged(newScenario) {
      if (!newScenario) {
        return; // just a title edit
      } else {
        var stateToGo =
          ($state.current.name === 'smaa-results' ||
            $state.current.name === 'deterministic-results') ? $state.current.name : 'preferences';
        $state.go(stateToGo, {
          workspaceId: $scope.workspace.id,
          problemId: $scope.subProblem.id,
          id: newScenario.id
        });

      }
    }
  }
  return dependencies.concat(MCDABenefitRiskController);
});

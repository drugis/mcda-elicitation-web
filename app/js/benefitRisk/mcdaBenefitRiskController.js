'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$transitions',
    '$state',
    '$stateParams',
    '$modal',
    'McdaBenefitRiskService',
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

  function MCDABenefitRiskController(
    $scope,
    $transitions,
    $state,
    $stateParams,
    $modal,
    McdaBenefitRiskService,
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

    // set on scope for testing purposes
    $scope.updateScales = updateScales;
    $scope.updateState = updateState;
    $scope.deregisterTransitionListener = $transitions.onStart({}, function(transition) {
      setActiveTab(transition.to().name, transition.to().name);
    });

    // init
    var baseProblem = $scope.workspace.problem;
    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.selections = {};
    $scope.isDuplicateScenarioTitle = false;
    $scope.tasks = _.keyBy(Tasks.available, 'id');

    $scope.scalesPromise = WorkspaceService.getObservedScales(baseProblem);
    $scope.updateState(currentScenario);
    $scope.effectsTableInfo = EffectsTableService.createEffectsTableInfo(baseProblem.performanceTable);

    $scope.subProblems = subProblems;
    $scope.subProblem = currentSubProblem;
    $scope.workspace.scales = {};
    $scope.isStandalone = isMcdaStandalone;
    determineActiveTab();

    $scope.$watch('scenario.state', updateTaskAccessibility);
    $scope.$watch('aggregateState', checkHasNoStochasticResults, true);
    $scope.$on('$destroy', function() {
      $scope.deregisterTransitionListener();
    });
    $scope.$on('elicit.settingsChanged', function() {
      $scope.updateScales($scope.workspace.scales.base);
    });
    $scope.$on('elicit.resultsAccessible', function(event, scenario) {
      $scope.updateState(scenario);
    });

    function updateState(scenario) {
      $scope.scenario = scenario;
      $scope.baseAggregateState = WorkspaceService.buildAggregateState(baseProblem, currentSubProblem, scenario);
      $scope.aggregateState = WorkspaceSettingsService.usePercentage() ?
        WorkspaceService.percentifyCriteria($scope.baseAggregateState) : $scope.baseAggregateState;
      checkForMissingValuesInPerformanceTable();
      checkHasNoStochasticResults();

      $scope.scalesPromise.then(function(observedScales) {
        $scope.workspace.scales.base = observedScales;
        $scope.workspace.scales.basePercentified = WorkspaceService.percentifyScales(baseProblem.criteria, observedScales);
        $scope.updateScales(observedScales);
      });

      updateScenarios();
    }

    function checkForMissingValuesInPerformanceTable() {
      $scope.hasMissingValues = _.find($scope.aggregateState.problem.performanceTable, function(tableEntry) {
        return tableEntry.performance.type === 'empty';
      });
    }

    function checkHasNoStochasticResults() {
      $scope.hasNoStochasticResults = WorkspaceService.hasNoStochasticResults($scope.aggregateState);
    }

    function updateScales(baseObservedScales) {
      $scope.aggregateState = WorkspaceSettingsService.usePercentage() ?
        WorkspaceService.percentifyCriteria($scope.baseAggregateState) : $scope.baseAggregateState;
      var baseCriteria = $scope.baseAggregateState.problem.criteria;
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

    function determineActiveTab() {
      setActiveTab($state.current.name, 'evidence');
    }

    function setActiveTab(activeStateName, defaultStateName) {
      var task = findAvailableTask(activeStateName);
      $scope.activeTab = task ? task.activeTab : defaultStateName;
    }

    function findAvailableTask(taskId) {
      return _.find(Tasks.available, function(task) {
        return task.id === taskId;
      });
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
              McdaBenefitRiskService.forkScenarioAndGo(newTitle, $scope.subProblem);
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
              McdaBenefitRiskService.newScenarioAndGo(newTitle, $scope.workspace, $scope.subProblem);
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

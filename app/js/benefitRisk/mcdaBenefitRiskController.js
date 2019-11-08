'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    '$scope',
    '$transitions',
    '$state',
    '$stateParams',
    'Tasks',
    'TaskDependencies',
    'ScenarioResource',
    'WorkspaceService',
    'WorkspaceSettingsService',
    'EffectsTableService',
    'TabService',
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
    Tasks,
    TaskDependencies,
    ScenarioResource,
    WorkspaceService,
    WorkspaceSettingsService,
    EffectsTableService,
    TabService,
    subProblems,
    currentSubProblem,
    currentScenario,
    isMcdaStandalone
  ) {
    $scope.scenarioChanged = scenarioChanged;

    $scope.tabStatus = {};
    $scope.deregisterTransitionListener = $transitions.onStart({}, function(transition) {
      initializeTabs(transition.to().name);
    });
    var baseProblem = angular.copy($scope.workspace.problem);
    var baseState = { problem: baseProblem };
    var percentifiedBaseState = WorkspaceService.percentifyCriteria(baseState);
    var dePercentifiedBaseState = WorkspaceService.dePercentifyCriteria(baseState);
    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.selections = {};
    $scope.isDuplicateScenarioTitle = false;
    $scope.tasks = _.keyBy(Tasks.available, 'id');

    $scope.scalesPromise = WorkspaceService.getObservedScales(baseProblem).then(function(observedScales) {
      initState(observedScales, currentScenario);
    });
    $scope.effectsTableInfo = EffectsTableService.createEffectsTableInfo(baseProblem.performanceTable);

    $scope.subProblems = subProblems;
    $scope.subProblem = currentSubProblem;
    $scope.workspace.scales = {};
    $scope.isStandalone = isMcdaStandalone;

    $scope.$watch('scenario.state', updateTaskAccessibility);

    $scope.$on('$destroy', function() {
      $scope.deregisterTransitionListener();
    });
    $scope.$on('elicit.settingsChanged', function() {
      updateAggregatedState(); // prevent event as first argument
      updateScales();
      updateScenarios();
    });
    $scope.$on('elicit.resultsAccessible', function(event, scenario) {
      updateAggregatedState(scenario);
      updateScales();
      updateScenarios();
      updateTaskAccessibility();
      initializeTabs($state.current.name);
    });

    function initState(observedScales, scenario) {
      $scope.workspace.scales.base = observedScales;
      $scope.workspace.scales.basePercentified = WorkspaceService.percentifyScales(percentifiedBaseState.problem.criteria, observedScales);
      $scope.baseState = {
        percentified: addScales(percentifiedBaseState, $scope.workspace.scales.basePercentified),
        dePercentified: addScales(dePercentifiedBaseState, $scope.workspace.scales.base)
      };
      updateAggregatedState(scenario);
      updateScales();
      updateScenarios();
      updateTaskAccessibility();
      initializeTabs($state.current.name);
    }

    function updateAggregatedState(scenario) {
      if (scenario) {
        $scope.scenario = scenario;
      } else {
        scenario = $scope.scenario;
      }
      var aggregateState = WorkspaceService.buildAggregateState($scope.baseState.dePercentified.problem, currentSubProblem, scenario);
      var stateCopy = angular.copy(aggregateState);
      aggregateState.percentified = WorkspaceService.percentifyCriteria(stateCopy);
      aggregateState.dePercentified = WorkspaceService.dePercentifyCriteria(stateCopy);

      $scope.aggregateState = aggregateState;
    }

    function addScales(state, scales) {
      return _.merge({}, state, {
        problem: WorkspaceService.setDefaultObservedScales(state.problem, scales)
      });
    }

    function updateScales() {
      if (WorkspaceSettingsService.usePercentage()) {
        $scope.workspace.scales.observed = $scope.workspace.scales.basePercentified;
      } else {
        $scope.workspace.scales.observed = $scope.workspace.scales.base;
      }
    }

    function updateScenarios() {
      ScenarioResource.query(_.omit($stateParams, ['id'])).$promise.then(function(scenarios) {
        $scope.scenarios = scenarios;
        $scope.scenariosWithResults = WorkspaceService.filterScenariosWithResults(baseProblem, currentSubProblem, scenarios);
      });
    }

    function initializeTabs(stateName) {
      $scope.tabStatus = TabService.getTabStatus(
        stateName,
        $scope.aggregateState,
        $scope.tasksAccessibility
      );
    }

    function updateTaskAccessibility() {
      $scope.tasksAccessibility = {
        preferences: TaskDependencies.isAccessible($scope.tasks.preferences, $scope.aggregateState).accessible,
        results: TaskDependencies.isAccessible($scope.tasks.results, $scope.aggregateState).accessible
      };
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

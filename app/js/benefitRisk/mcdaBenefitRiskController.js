'use strict';
define(['lodash', 'angular'], function (_, angular) {
  var dependencies = [
    '$scope',
    '$transitions',
    '$state',
    '$stateParams',
    'Tasks',
    'TaskDependencies',
    'ScenarioResource',
    'WorkspaceService',
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
    TabService,
    subProblems,
    currentSubProblem,
    currentScenario,
    isMcdaStandalone
  ) {
    $scope.scenarioChanged = scenarioChanged;
    $scope.updateAngularScenario = updateAngularScenario;

    $scope.tabStatus = {};
    $scope.deregisterTransitionListener = $transitions.onStart(
      {},
      function (transition) {
        initializeTabs(transition.to().name);
      }
    );
    var baseProblem = angular.copy($scope.workspace.problem);

    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.selections = {};
    $scope.isDuplicateScenarioTitle = false;
    $scope.tasks = _.keyBy(Tasks.available, 'id');

    initState(currentScenario);

    $scope.subProblems = subProblems;
    $scope.subProblem = currentSubProblem;
    $scope.isStandalone = isMcdaStandalone;

    $scope.$watch('scenario.state', updateTaskAccessibility);

    $scope.$on('$destroy', function () {
      $scope.deregisterTransitionListener();
    });
    $scope.$on('elicit.resultsAccessible', function (event, scenario) {
      updateAggregatedState(scenario);
      updateScenarios();
      updateTaskAccessibility();
      initializeTabs($state.current.name);
    });

    function initState(scenario) {
      updateAggregatedState(scenario);
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
      var aggregateState = WorkspaceService.buildAggregateState(
        baseProblem,
        currentSubProblem,
        scenario
      );
      $scope.aggregateState = aggregateState;
    }

    function updateScenarios() {
      return ScenarioResource.query(_.omit($stateParams, ['id'])).$promise.then(
        (scenarios) => {
          $scope.scenarios = scenarios;
          $scope.reactScenarios = _.map(scenarios, (scenario) => {
            return {
              id: scenario.id,
              title: scenario.title,
              state: scenario.state,
              subproblemId: scenario.subProblemId
            };
          });
        }
      );
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
        preferences: TaskDependencies.isAccessible(
          $scope.tasks.preferences,
          $scope.aggregateState
        ).accessible,
        results: TaskDependencies.isAccessible(
          $scope.tasks.results,
          $scope.aggregateState
        ).accessible
      };
    }

    function scenarioChanged(newScenario) {
      if (!newScenario) {
        return; // just a title edit
      } else {
        var stateToGo =
          $state.current.name === 'smaa-results' ||
          $state.current.name === 'deterministic-results'
            ? $state.current.name
            : 'preferences';
        $state.go(stateToGo, {
          workspaceId: $scope.workspace.id,
          problemId: $scope.subProblem.id,
          id: newScenario.id
        });
      }
    }

    function updateAngularScenario(updatedScenario) {
      $scope.$emit('elicit.resultsAccessible', updatedScenario);
    }
  }
  return dependencies.concat(MCDABenefitRiskController);
});

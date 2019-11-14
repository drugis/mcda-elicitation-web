'use strict';
define(['clipboard', 'lodash',], function(Clipboard, _) {
  var dependencies = [
    '$scope',
    '$stateParams',
    '$state',
    'currentScenario',
    'DeterministicResultsService',
    'SmaaResultsService',
    'OrderingService',
    'PageTitleService',
    'WorkspaceService',
    'WorkspaceSettingsService'
  ];

  var DeterministicResultsController = function(
    $scope,
    $stateParams,
    $state,
    currentScenario,
    DeterministicResultsService,
    SmaaResultsService,
    OrderingService,
    PageTitleService,
    WorkspaceService,
    WorkspaceSettingsService
  ) {
    // functions
    $scope.sensitivityScalesChanged = sensitivityScalesChanged;
    $scope.recalculateResults = recalculateResults;
    $scope.resetSensitivityAnalysis = resetSensitivityAnalysis;
    $scope.isEditing = isEditing;

    // init
    $scope.scenario = currentScenario;

    $scope.scalesPromise.then(function() {
      $scope.scales = createScales($scope.aggregateState.dePercentified.problem);
      PageTitleService.setPageTitle('DeterministicResultsController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s deterministic results');
    });
    $scope.sensitivityMeasurements = {
      alteredTableCells: [],
      isEditing: false
    };
    new Clipboard('.clipboard-button');

    $scope.$on('elicit.settingsChanged', function() {
      $state.reload();
    });

    $scope.$watch('scales.observed', function() {
      resetSensitivityAnalysis();
    });

    $scope.$on('elicit.legendChanged', function() {
      loadState();
    });

    var orderingsPromise = $scope.scalesPromise.then(function() {
      $scope.problem = WorkspaceSettingsService.usePercentage() ? $scope.aggregateState.percentified.problem : $scope.aggregateState.dePercentified.problem;
      return OrderingService.getOrderedCriteriaAndAlternatives($scope.problem, $stateParams).then(function(ordering) {
        $scope.criteria = ordering.criteria;
        $scope.alternatives = ordering.alternatives;
        loadState();
      });
    });

    function createScales(problem) {
      $scope.scalesPromise.then(function() {
        var newScales = DeterministicResultsService.createDeterministicScales(problem.performanceTable, $scope.workspace.scales.base);
        $scope.scales = {
          observed: WorkspaceSettingsService.usePercentage() ?
            WorkspaceService.percentifyScales($scope.aggregateState.percentified.problem.criteria, newScales) : newScales
        };
      });
    }

    function loadState() {
      var stateWithAlternativesRenamed = SmaaResultsService.replaceAlternativeNames($scope.scenario.state.legend,
        $scope.aggregateState);
      initSensitivityDropdowns();

      $scope.deterministicResults = DeterministicResultsService.getDeterministicResults($scope, stateWithAlternativesRenamed);
    }

    function initSensitivityDropdowns() {
      $scope.sensitivityMeasurements.preferencesCriterion = $scope.criteria[0];
    }

    function isEditing(value) {
      $scope.sensitivityMeasurements.isEditing = value;
    }

    function resetSensitivityAnalysis() {
      orderingsPromise.then(function() {
        $scope.modifiableScales = DeterministicResultsService.resetModifiableScales(
          $scope.scales.observed, _.keyBy($scope.alternatives, 'id'));
        delete $scope.recalculatedDeterministicResults;
        $scope.sensitivityMeasurements.alteredTableCells = [];
      });
    }

    function sensitivityScalesChanged(newValue, row, alternative) {
      $scope.modifiableScales[row.dataSource.id][alternative.id]['50%'] = newValue;
      $scope.sensitivityMeasurements.alteredTableCells.push({
        criterion: row.criterion.id,
        alternative: alternative.id,
        value: usePercentage(row.dataSource) ? newValue / 100 : newValue
      });
    }

    function recalculateResults() {
      delete $scope.recalculatedDeterministicResults;
      $scope.recalculatedDeterministicResults = DeterministicResultsService.getRecalculatedDeterministicResults($scope, $scope.state);
    }

    function usePercentage(dataSource) {
      return dataSource.unitOfMeasurement.type === 'percentage';
    }
  };
  return dependencies.concat(DeterministicResultsController);
});

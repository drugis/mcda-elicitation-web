'use strict';
define(['clipboard', 'lodash',], function(Clipboard, _) {
  var dependencies = [
    '$scope',
    '$stateParams',
    '$state',
    'currentScenario',
    'MCDAResultsService',
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
    MCDAResultsService,
    OrderingService,
    PageTitleService,
    WorkspaceService,
    WorkspaceSettingsService
  ) {
    // functions
    $scope.sensitivityScalesChanged = sensitivityScalesChanged;
    $scope.recalculateResults = recalculateResults;
    $scope.resetSensitivityAnalysis = resetSensitivityAnalysis;
    $scope.doMeasurementSensitivity = doMeasurementSensitivity;
    $scope.doPreferencesSensitivity = doPreferencesSensitivity;
    $scope.isEditing = isEditing;
    $scope.loadState = loadState;

    // init
    $scope.scenario = currentScenario;
    $scope.scales = createScales($scope.dePercentifiedBaseState.problem);
    $scope.sensitivityMeasurements = {
      alteredTableCells: [],
      isEditing: false
    };
    new Clipboard('.clipboard-button');
    PageTitleService.setPageTitle('DeterministicResultsController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s deterministic results');

    $scope.$on('elicit.settingsChanged', function() {
      $state.reload();
    });

    $scope.$watch('scales.observed', function() {
      resetSensitivityAnalysis();
    });

    var orderingsPromise = $scope.scalesPromise.then(function() {
      return OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(ordering) {
        $scope.criteria = ordering.criteria;
        $scope.alternatives = ordering.alternatives;
        loadState();
      });
    });

    function createScales(problem) {
      $scope.scalesPromise.then(function() {
        var newScales = MCDAResultsService.createDeterministicScales(problem.performanceTable, $scope.workspace.scales.observed);
        $scope.scales = {
          observed: WorkspaceSettingsService.usePercentage() ? WorkspaceService.percentifyScales($scope.aggregateState.problem.criteria, newScales) : newScales
        };
      });
    }


    function loadState() {
      var stateWithAlternativesRenamed = MCDAResultsService.replaceAlternativeNames($scope.scenario.state.legend, $scope.aggregateState);
      initSensitivityDropdowns();
      doMeasurementSensitivity();
      doPreferencesSensitivity();

      $scope.deterministicResults = MCDAResultsService.getDeterministicResults($scope, stateWithAlternativesRenamed);
      $scope.state = MCDAResultsService.getResults($scope, stateWithAlternativesRenamed);
    }

    function initSensitivityDropdowns() {
      $scope.sensitivityMeasurements.measurementsAlternative = $scope.alternatives[0];
      $scope.sensitivityMeasurements.measurementsCriterion = $scope.criteria[0];
      $scope.sensitivityMeasurements.preferencesCriterion = $scope.criteria[0];

    }
    function isEditing(value) {
      $scope.sensitivityMeasurements.isEditing = value;
    }

    function resetSensitivityAnalysis() {
      orderingsPromise.then(function() {
        $scope.modifiableScales = MCDAResultsService.resetModifiableScales(
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
      $scope.recalculatedDeterministicResults = MCDAResultsService.getRecalculatedDeterministicResults($scope, $scope.state);
    }

    function doMeasurementSensitivity() {
      delete $scope.measurementValues;
      MCDAResultsService.getMeasurementsSensitivityResults($scope, $scope.dePercentifiedBaseState).resultsPromise.then(function(result) {
        $scope.measurementValues = MCDAResultsService.pataviResultToLineValues(result.results, $scope.alternatives, $scope.scenario.state.legend);

        if (usePercentage($scope.sensitivityMeasurements.measurementsCriterion.dataSources[0])) {
          $scope.measurementValues = MCDAResultsService.percentifySensitivityResult($scope.measurementValues, 'x');
        }
      });
    }

    function doPreferencesSensitivity() {
      delete $scope.preferencesValues;
      MCDAResultsService.getPreferencesSensitivityResults($scope, $scope.dePercentifiedBaseState).resultsPromise.then(function(result) {
        $scope.preferencesValues = MCDAResultsService.pataviResultToLineValues(result.results, $scope.alternatives, $scope.scenario.state.legend);
      });
    }

    function usePercentage(dataSource) {
      return dataSource.unitOfMeasurement.type === 'percentage';
    }
  };
  return dependencies.concat(DeterministicResultsController);
});

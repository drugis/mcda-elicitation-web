'use strict';
define(['clipboard', 'lodash',], function(Clipboard, _) {
  var dependencies = [
    '$scope',
    '$stateParams',
    '$state',
    'currentScenario',
    'MCDAResultsService',
    'EffectsTableService',
    'OrderingService',
    'PageTitleService',
    'WorkspaceSettingsService'
  ];

  var DeterministicResultsController = function(
    $scope,
    $stateParams,
    $state,
    currentScenario,
    MCDAResultsService,
    EffectsTableService,
    OrderingService,
    PageTitleService,
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
    $scope.scales = $scope.workspace.scales;
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
        $scope.tableRows = EffectsTableService.buildEffectsTable(ordering.criteria);
        $scope.alternatives = ordering.alternatives;
        $scope.nrAlternatives = _.keys($scope.alternatives).length;
        loadState();
      });
    });

    function loadState() {
      var stateWithAlternativesRenamed = MCDAResultsService.replaceAlternativeNames($scope.scenario.state.legend, $scope.baseAggregateState);
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
        value: newValue
      });
    }

    function recalculateResults() {
      delete $scope.recalculatedDeterministicResults;
      $scope.recalculatedDeterministicResults = MCDAResultsService.getRecalculatedDeterministicResults($scope, $scope.state);
    }

    function doMeasurementSensitivity() {
      delete $scope.measurementValues;
      MCDAResultsService.getMeasurementsSensitivityResults($scope, $scope.baseAggregateState).resultsPromise.then(function(result) {
        $scope.measurementValues = MCDAResultsService.pataviResultToLineValues(result.results, $scope.alternatives, $scope.scenario.state.legend);

        if (usePercentage($scope.sensitivityMeasurements.measurementsCriterion)) {
          $scope.measurementValues = MCDAResultsService.percentifySensitivityResult($scope.measurementValues, 'x');
        }
      });
    }

    function doPreferencesSensitivity() {
      delete $scope.preferencesValues;
      MCDAResultsService.getPreferencesSensitivityResults($scope, $scope.baseAggregateState).resultsPromise.then(function(result) {
        $scope.preferencesValues = MCDAResultsService.pataviResultToLineValues(result.results, $scope.alternatives, $scope.scenario.state.legend);
      });
    }

    function usePercentage(criterion) {
      return _.isEqual(criterion.dataSources[0].scale, [0, 100]);
    }
  };
  return dependencies.concat(DeterministicResultsController);
});

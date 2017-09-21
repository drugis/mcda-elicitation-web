'use strict';
define(function(require) {
  var _ = require('lodash');

  var dependencies = ['$scope', 'currentScenario', 'taskDefinition', 'MCDAResultsService', 'addKeyHashToObject'];

  var DeterministicResultsController = function($scope, currentScenario, taskDefinition, MCDAResultsService, addKeyHashToObject) {
    // functions
    $scope.sensitivityScalesChanged = sensitivityScalesChanged;
    $scope.recalculateResults = recalculateResults;
    $scope.resetSensitivityAnalysis = resetSensitivityAnalysis;
    $scope.doMeasurementSensitivity = doMeasurementSensitivity;
    $scope.doPreferencesSensitivity = doPreferencesSensitivity;

    // init
    $scope.scenario = currentScenario;
    $scope.scales = $scope.workspace.$$scales;
    $scope.sensitivityMeasurements = {
      alteredTableCells: []
    };
    $scope.state = initialize(taskDefinition.clean($scope.aggregateState));
    $scope.$watch('scales.observed', function() {
      resetSensitivityAnalysis();
    });

    function resetSensitivityAnalysis() {
      $scope.modifiableScales = MCDAResultsService.resetModifiableScales(
        $scope.scales.observed, $scope.state.problem.alternatives);
      delete $scope.recalculatedDeterministicResults;
      $scope.sensitivityMeasurements.alteredTableCells = [];
    }

    function sensitivityScalesChanged(newValue, criterion, alternative) {
      $scope.modifiableScales[criterion.id][alternative.id]['50%'] = newValue;
      $scope.sensitivityMeasurements.alteredTableCells.push( {
        criterion: criterion.id,
        alternative: alternative.id,
        value: newValue
      });
    }

    function recalculateResults() {
      delete $scope.recalculatedDeterministicResults;
      $scope.recalculatedDeterministicResults = MCDAResultsService.getRecalculatedDeterministicResulsts($scope, $scope.state);
    }

    function initialize(state) {
      $scope.alternatives = _.map(state.problem.alternatives, function(alternative, key) {
        return addKeyHashToObject(alternative, key);
      });
      $scope.sensitivityMeasurements.measurementsAlternative = $scope.alternatives[0];
      $scope.criteria = _.map(state.problem.criteria, function(criterion, key) {
        return addKeyHashToObject(criterion, key);
      });
      $scope.sensitivityMeasurements.measurementsCriterion = $scope.criteria[0];
      $scope.sensitivityMeasurements.preferencesCriterion = $scope.criteria[0];

      $scope.deterministicResults = MCDAResultsService.getDeterministicResults($scope, state);
      var overallResults = MCDAResultsService.getResults($scope, state);
      doMeasurementSensitivity(state);
      doPreferencesSensitivity(state);
      return overallResults;
    }

    function doMeasurementSensitivity(state) {
      delete $scope.measurementValues;
      MCDAResultsService.getMeasurementsSensitivityResults($scope, state).resultsPromise.then(function(result) {
        $scope.measurementValues = MCDAResultsService.pataviResultToLineValues(result.results, $scope.alternatives);
      });
    }

    function doPreferencesSensitivity(state) {
      delete $scope.preferencesValues;
      MCDAResultsService.getPreferencesSensitivityResults($scope, state).resultsPromise.then(function(result) {
        $scope.preferencesValues = MCDAResultsService.pataviResultToLineValues(result.results, $scope.alternatives);
      });
    }
  };
  return dependencies.concat(DeterministicResultsController);
});
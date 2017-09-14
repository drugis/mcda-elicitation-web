'use strict';
define(function(require) {
  var _ = require('lodash');

  var dependencies = ['$scope', '$q', 'currentScenario', 'taskDefinition', 'MCDAResultsService', 'addKeyHashToObject'];

  var ResultsController = function($scope, $q, currentScenario, taskDefinition, MCDAResultsService, addKeyHashToObject) {
    // functions
    $scope.sensitivityScalesChanged = sensitivityScalesChanged;
    $scope.recalculateResults = recalculateResults;
    $scope.resetSensitivityAnalysis = resetSensitivityAnalysis;

    // init
    $scope.scenario = currentScenario;
    $scope.scales = $scope.workspace.$$scales;
    $scope.state = initialize(taskDefinition.clean($scope.aggregateState));
    $scope.$watch('scales.observed', function() {
      resetSensitivityAnalysis();
    });

    function resetSensitivityAnalysis() {
      $scope.modifiableScales = MCDAResultsService.resetModifiableScales(
        $scope.scales.observed, $scope.state.problem.alternatives);
    }

    function sensitivityScalesChanged(newScales) {
      $scope.modifiableScales = newScales;
    }

    function recalculateResults() {
      var alteredState = _.cloneDeep($scope.aggregateState);
      alteredState.problem.performanceTable = _.map($scope.aggregateState.problem.performanceTable, function(tableEntry) {
        var newEntry = _.cloneDeep(tableEntry);
        if (newEntry.performance.type === 'exact') {
          newEntry.performance.value = $scope.modifiableScales[newEntry.criterion][newEntry.alternative]['50%'];
        }
        return newEntry;
      });
      $scope.state = initialize(taskDefinition.clean(alteredState));
      $scope.state.showSensitivity = true;
    }

    function initialize(state) {
      $scope.alternatives = _.map(state.problem.alternatives, function(alternative, key) {
        return addKeyHashToObject(alternative, key);
      });
      $scope.oneWaySensitivityAlternative = $scope.alternatives[0];
      $scope.criteria = _.map(state.problem.criteria, function(criterion, key) {
        return addKeyHashToObject(criterion, key);
      });
      $scope.oneWaySensitivityCriterion = $scope.criteria[0];
      $scope.types = _.reduce(state.problem.performanceTable, function(accum, tableEntry) {
        if (!accum[tableEntry.criterion]) {
          accum[tableEntry.criterion] = {};
        }
        if (tableEntry.alternative) {
          accum[tableEntry.criterion][tableEntry.alternative] = tableEntry.performance.type;
        } else {
          accum[tableEntry.criterion] = tableEntry.performance.type;
        }
        return accum;
      }, {});
      $scope.deterministicResults = MCDAResultsService.getDeterministicResults($scope, state);
      var measurementsSensitivityResultsLower = MCDAResultsService.getMeasurementsSensitivityResultsLower($scope, state);
      var measurementsSensitivityResultsUpper = MCDAResultsService.getMeasurementsSensitivityResultsUpper($scope, state);
      $scope.measurementSentitivityValuesPromise = $q.all([
        measurementsSensitivityResultsLower.resultsPromise,
        measurementsSensitivityResultsUpper.resultsPromise
      ]);
      return MCDAResultsService.getResults($scope, state);
    }

  };
  return dependencies.concat(ResultsController);
});
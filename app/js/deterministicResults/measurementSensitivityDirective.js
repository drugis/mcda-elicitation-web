'use strict';
define([], function () {
  var dependencies = ['DeterministicResultsService'];
  var MeasurementSensitivityDirective = function (DeterministicResultsService) {
    return {
      restrict: 'E',
      scope: {
        aggregateState: '=',
        alternatives: '=',
        criteria: '=',
        editMode: '=',
        scenario: '='
      },
      templateUrl: './measurementSensitivityDirective.html',
      link: function (scope) {
        scope.doMeasurementSensitivity = doMeasurementSensitivity;

        scope.$on('elicit.legendChanged', init);

        init();

        function init() {
          scope.measurementsAlternative = scope.alternatives[0];
          scope.measurementsCriterion = scope.criteria[0];
          doMeasurementSensitivity();
        }

        function doMeasurementSensitivity() {
          scope.plotOptions = {
            useTooltip: false,
            labelXAxis: scope.measurementsCriterion.title,
            labelYAxis: 'total value'
          };

          delete scope.measurementValues;
          DeterministicResultsService.getMeasurementSensitivityResults(
            scope.measurementsAlternative.id,
            scope.measurementsCriterion.id,
            scope.aggregateState.dePercentified
          ).resultsPromise.then(function (result) {
            scope.measurementValues = DeterministicResultsService.pataviResultToLineValues(
              result.results,
              scope.alternatives,
              scope.scenario.state.legend
            );

            if (usePercentage(scope.measurementsCriterion.dataSources[0])) {
              scope.measurementValues = DeterministicResultsService.percentifySensitivityResult(
                scope.measurementValues
              );
            }
          });
        }

        function usePercentage(dataSource) {
          return dataSource.unitOfMeasurement.type === 'percentage';
        }
      }
    };
  };
  return dependencies.concat(MeasurementSensitivityDirective);
});

'use strict';
define([], function() {
  var dependencies = ['MCDAResultsService'];

  var MeasurementsSensitivityPlot = function(ResultsService) {
    return {
      restrict: 'E',
      scope: {
        valuesPromise: '=',
        selectedCriterion: '=',
        alternatives: '='
      },
      template: '<line-chart value="lineValues"></line-chart>',
      link: function(scope) {
        scope.$watch('valuesPromise', function(newPromise){
          newPromise.then(function(result) {
            scope.lineValues = ResultsService.pataviResultToMeasurementsSensitivityLineValues(result.results, 
              scope.selectedCriterion, scope.alternatives);
          });
        });
      }
    };
  };
  return dependencies.concat(MeasurementsSensitivityPlot);
});
'use strict';
define(['lodash', 'd3', 'nvd3'], function(_, d3, nv) {
  var dependencies = ['MCDAResultsService'];

  var MeasurementsSensitivityPlot = function(ResultsService) {
    function getParentDimension(element) {
      function parsePx(str) {
        return parseInt(str.replace(/px/gi, ''));
      }
      var width = parsePx($(element[0].parentNode).css('width'));
      var height = parsePx($(element[0].parentNode).css('height'));

      return {
        width: width,
        height: height
      };
    }

    return {
      restrict: 'E',
      scope: {
        valuesPromise: '=',
        criteria: '=',
        alternatives: '='
      },
      template: '<line-chart value="lineValues"></line-chart>',
      link: function(scope) {
        scope.valuesPromise.then(function(values) {
          scope.lineValues = ResultsService.pataviResultToLineValues(values[0].results, values[1].results, 
            scope.criteria, scope.alternatives);
        });
      }
    };
  };
  return dependencies.concat(MeasurementsSensitivityPlot);
});
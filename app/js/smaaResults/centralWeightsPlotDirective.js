'use strict';
define(['d3', 'c3'], function (d3, c3) {
  var dependencies = ['SmaaResultsService'];

  var CentralWeightsPlot = function (SmaaResultsService) {
    return {
      restrict: 'E',
      scope: {
        values: '='
      },
      templateUrl: './centralWeightsPlotDirective.html',
      link: function (scope, element) {
        scope.$watch('values', function (results) {
          if (!results) {
            return;
          } else {
            var root = d3.select(element[0]);
            root = root.select('#central-weights-plot');
            root.style('width', '620px').style('height', '350px');

            var settings = SmaaResultsService.getCentralWeightsPlotSettings(
              results,
              root
            );
            c3.generate(settings);
          }
        });
      }
    };
  };
  return dependencies.concat(CentralWeightsPlot);
});

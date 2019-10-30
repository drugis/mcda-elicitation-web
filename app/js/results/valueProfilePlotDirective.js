'use strict';
define([
  'd3',
  'c3'
], function(
  d3,
  c3
) {
  var dependencies = ['DeterministicResultsService'];

  var ValueProfilePlot = function(DeterministicResultsService) {
    return {
      restrict: 'E',
      scope: {
        values: '=',
        criteria: '=',
        alternatives: '=',
        alternativesLegend: '='
      },
      template: '<div id="value-plot"></div>',
      link: function(scope, element) {
        scope.$watch('values', function(results) {
          if (!results) {
            return;
          } else {
            var root = d3.select(element[0]);
            root = root.select('#value-plot');
            root
            .style('width', '400px')
            .style('height', '400px');
            var settings = DeterministicResultsService.getValueProfilePlotSettings(
              results,
              scope.criteria,
              scope.alternatives,
              scope.alternativesLegend,
              root);
            c3.generate(settings);
          }
        });
      }
    };
  };
  return dependencies.concat(ValueProfilePlot);
});

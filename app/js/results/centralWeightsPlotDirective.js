'use strict';
define([
  'd3',
  'c3'
], function(
  d3,
  c3
) {
  var dependencies = ['MCDAResultsService'];

  var CentralWeightsPlot = function(MCDAResultsService) {
    return {
      restrict: 'E',
      scope: {
        values: '='
      },
      templateUrl: './centralWeightsPlotDirective.html',
      link: function(scope, element) {
        scope.$watch('values', function(results) {
          if (!results) {
            return;
          } else {
            var root = d3.select(element[0]);
            root = root.select('#central-weights');
            root
              .style('width', '620px')
              .style('height', '350px');

            var settings = MCDAResultsService.getCentralWeightsPlotSettings(
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

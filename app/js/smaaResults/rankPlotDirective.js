'use strict';
define([
  'd3',
  'c3'
], function(
  d3,
  c3
) {
  var dependencies = ['SmaaResultsService'];

  var RankPlot = function(SmaaResultsService) {
    return {
      restrict: 'E',
      scope: {
        alternatives: '=',
        labels: '=',
        values: '='
      },
      templateUrl: './rankPlotDirective.html',
      link: function(scope, element) {
        scope.$watch('values', function(results) {
          if (!results) {
            return;
          } else {
            var root = d3.select(element[0]);
            root = root.select('#rank-plot');
            root
              .style('width', '400px')
              .style('height', '400px');

            var settings = SmaaResultsService.getRankPlotSettings(
              results,
              scope.alternatives,
              scope.labels,
              root);
            c3.generate(settings);
          }
        });
      }
    };
  };
  return dependencies.concat(RankPlot);
});

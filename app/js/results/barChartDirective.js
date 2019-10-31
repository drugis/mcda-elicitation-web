'use strict';
define([
  'd3',
  'c3'
], function(
  d3,
  c3
) {
  var dependencies = ['SmaaResultsService'];

  var BarChart = function(SmaaResultsService) {
    return {
      restrict: 'E',
      scope: {
        values: '='
      },
      templateUrl: './barChartDirective.html',
      link: function(scope, element) {
        scope.$watch('values', function(results) {
          if (!results) {
            return;
          } else {
            var root = d3.select(element[0]);
            root = root.select('#bar-chart');
            root
              .style('width', '400px')
              .style('height', '350px');

            var settings = SmaaResultsService.getBarChartSettings(
              results,
              root
            );
            c3.generate(settings);
          }
        });
      }
    };
  };
  return dependencies.concat(BarChart);
});

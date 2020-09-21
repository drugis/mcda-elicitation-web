'use strict';
define(['d3', 'c3'], function (d3, c3) {
  var dependencies = ['DeterministicResultsService'];

  var LineChart = function (DeterministicResultsService) {
    return {
      restrict: 'E',
      scope: {
        plotOptions: '=',
        values: '='
      },
      template: '<div class="preferences-sensitivity-plot"></div>',
      link: function (scope, element) {
        scope.$watch('values', function (newVal) {
          if (!newVal) {
            return;
          } else {
            var root = d3.select(element[0]);
            root = root.select('.preferences-sensitivity-plot');
            root.style('width', '400px').style('height', '400px');
            var settings = DeterministicResultsService.getSensitivityLineChartSettings(
              root,
              scope.values,
              scope.plotOptions
            );
            c3.generate(settings);
          }
        });
      }
    };
  };
  return dependencies.concat(LineChart);
});

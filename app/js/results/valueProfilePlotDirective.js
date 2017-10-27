'use strict';
define(['d3', 'nvd3'], function(d3, nv) {
  var dependencies = [ 'MCDAResultsService'];

  var ValueProfilePlot = function(ResultsService) {
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
        values: '=',
        criteria: '=',
        alternatives: '='
      },
      template: '<div style="width: 400px; height: 400px;"></div>',
      link: function(scope, element) {
        var svg = d3.select(element[0].children[0]).append('svg')
          .attr('width', '100%')
          .attr('height', '100%');

        var dim = getParentDimension(element[0].children);
        scope.$watch('values', function(newVal) {
          if (!newVal) {
            return;
          }
          nv.addGraph(function() {
            var chart = nv.models.multiBarChart().height(dim.height).width(dim.width);
            var data = ResultsService.pataviResultToValueProfile(newVal, scope.criteria, scope.alternatives);

            chart.yAxis.tickFormat(d3.format(',.3g'));
            chart.stacked(true);
            chart.reduceXTicks(false);
            chart.staggerLabels(true);
            chart.showControls(false);

            svg.datum(data).transition().duration(100).call(chart);
            svg.style('background', 'white');
              
            nv.utils.windowResize(chart.update);
          });
        });
      }
    };
  };
  return dependencies.concat(ValueProfilePlot);
});
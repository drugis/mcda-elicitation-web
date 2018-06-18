'use strict';
define(['lodash', 'd3', 'nvd3', 'jQuery'],
  function(_, d3, nv, $) {
    var dependencies = [

    ];
    var WillingnessToTradeOffChartDirective = function(

    ) {
      return {
        restrict: 'E',
        scope: {
          settings: '='
        },
        link: function(scope, element) {
          var dim = getParentDimension(element);
          var svg = d3.select(element[0]).append('svg')
            .attr('width', '100%')
            .attr('height', '100%');
          nv.addGraph(function() {
            var data = [
              {
                values: [{ x: 5, y: 5 },{ x: 4, y: 4 },{ x: 3, y: 3 },{ x: 2, y: 2 }, { x: 1, y: 1 }],
                key: 'test',
                color: 'black'
              },
              {
                values: [{ x: 3, y: 3, shape: 'diamond'}],
                key: 'test2 ',
                color: 'red'
              }
            ];
            var chart = nv.models.lineChart()
              .height(dim.height)
              .width(dim.width)
              .useVoronoi(true)
              .interpolate('linear')
              .pointActive(function(dot) {
                return dot.shape === 'diamond';
              })
              .duration(300)
              .color(d3.scale.category10().range());
            chart.xAxis.tickFormat(d3.format(',.3g'));
            chart.yAxis.tickFormat(d3.format(',.3g'));
            svg.datum(data).call(chart);
            nv.utils.windowResize(chart.update);
          });
          d3.selectAll('#willingness-to-trade-off-chart .nv-lineChart .nv-point').style('stroke-width',
          '7px').style('fill-opacity', '.95').style('stroke-opacity', '.95');


          function getParentDimension(element) {
            var width = parsePx($(element[0].parentNode).css('width'));
            var height = parsePx($(element[0].parentNode).css('height'));

            return {
              width: width,
              height: height
            };
          }
          function parsePx(str) {
            return parseInt(str.replace(/px/gi, ''));
          }
        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

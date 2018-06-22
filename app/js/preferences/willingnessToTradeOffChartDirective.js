'use strict';
define(['chartjs', 'jQuery'],
  function(Chart, $) {
    var dependencies = [

    ];
    var WillingnessToTradeOffChartDirective = function(

    ) {
      return {
        restrict: 'E',
        scope: {
          settings: '='
        },
        template: '<div><canvas id="willingnessChart" width="400" height="400"></canvas></div>',
        link: function(scope, element) {
          scope.$watch('settings', function(newSettings){
            if(newSettings){
              var ctx = document.getElementById('willingnessChart').getContext('2d');
              new Chart(ctx, {
                type: 'scatter',
                data: {
                  labels: [],
                  datasets: []
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        min: scope.settings.secondCriterion.dataSources[0].pvf.range[0],
                        max: scope.settings.secondCriterion.dataSources[0].pvf.range[1]
                      }
                    }],
                    xAxes: [{
                      ticks: {
                        min: scope.settings.firstCriterion.dataSources[0].pvf.range[0],
                        max: scope.settings.firstCriterion.dataSources[0].pvf.range[1]
                      }
                    }]
                  }
                }
              });
            }
          });
          var dim = getParentDimension(element);


          // var svg = d3.select(element[0]).append('svg')
          //   .attr('width', '100%')
          //   .attr('height', '100%');
          // nv.addGraph(function() {
          //   var data = [
          //     {
          //       values: [{ x: 5, y: 5 },{ x: 4, y: 4 },{ x: 3, y: 3 },{ x: 2, y: 2 }, { x: 1, y: 1 }],
          //       key: 'test',
          //       color: 'black'
          //     },
          //     {
          //       values: [{ x: 3, y: 3, shape: 'diamond'}],
          //       key: 'test2 ',
          //       color: 'red'
          //     }
          //   ];
          //   var chart = nv.models.lineChart()
          //     .height(dim.height)
          //     .width(dim.width)
          //     .useVoronoi(true)
          //     .interpolate('linear')
          //     .pointActive(function(dot) {
          //       return dot.shape === 'diamond';
          //     })
          //     .duration(300)
          //     .color(d3.scale.category10().range());
          //   chart.xAxis.tickFormat(d3.format(',.3g'));
          //   chart.yAxis.tickFormat(d3.format(',.3g'));
          //   svg.datum(data).call(chart);
          //   nv.utils.windowResize(chart.update);
          // });
          // svg.selectAll('svg .nv-lineChart .nv-point').style('stroke-width',
          // '7px').style('fill-opacity', '.95').style('stroke-opacity', '.95');


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

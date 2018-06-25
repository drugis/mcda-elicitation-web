'use strict';
define(['chartjs', 'jQuery'],
  function(Chart, $) {
    var dependencies = [
      '$timeout',
      'mcdaRootPath'
    ];
    var WillingnessToTradeOffChartDirective = function(
      $timeout,
      mcdaRootPath
    ) {
      return {
        restrict: 'E',
        scope: {
          settings: '='
        },
        templateUrl: mcdaRootPath + 'js/preferences/willingnessToTradeOffChartDirective.html',
        link: function(scope) {

          scope.updateChart = updateChart;

          scope.coordinates = {};

          scope.$watch('settings', function(newSettings) {
            if (newSettings) {
              var ctx = document.getElementById('willingnessChart').getContext('2d');
              scope.willingnessChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                  datasets: [{
                    label: 'First point',
                    fill: false,
                    data: []
                  }]
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
                  },
                  onClick: function(evt) {
                    // console.log(evt.offsetX + ',' + evt.offsetY);
                    var yTop = scope.willingnessChart.chartArea.top;
                    var yBottom = scope.willingnessChart.chartArea.bottom;
                    scope.coordinates.yMin = scope.willingnessChart.scales['y-axis-1'].min;
                    scope.coordinates.yMax = scope.willingnessChart.scales['y-axis-1'].max;
                    var newY = '';
                    var showstuff = 0;
                    if (evt.offsetY <= yBottom && evt.offsetY >= yTop) {
                      newY = Math.abs((evt.offsetY - yTop) / (yBottom - yTop));
                      newY = (newY - 1) * -1;
                      newY = newY * (Math.abs(scope.coordinates.yMax - scope.coordinates.yMin)) + scope.coordinates.yMin;
                      showstuff = 1;
                    }
                    var xTop = scope.willingnessChart.chartArea.left;
                    var xBottom = scope.willingnessChart.chartArea.right;
                    scope.coordinates.xMin = scope.willingnessChart.scales['x-axis-1'].min;
                    scope.coordinates.xMax = scope.willingnessChart.scales['x-axis-1'].max;
                    var newX = '';
                    if (evt.offsetX <= xBottom && evt.offsetX >= xTop && showstuff === 1) {
                      newX = Math.abs((evt.offsetX - xTop) / (xBottom - xTop));
                      newX = newX * (Math.abs(scope.coordinates.xMax - scope.coordinates.xMin)) + scope.coordinates.xMin;
                    }
                    if (newY !== '' && newX !== '') {
                      // console.log(newX + ',' + newY);
                      scope.coordinates.x = newX;
                      scope.coordinates.y = newY;
                      updateChart();
                    }
                  }
                }
              });
            }
          });

          function updateChart() {
            $timeout(function() {
              if ($.isNumeric(scope.coordinates.x) && $.isNumeric(scope.coordinates.y)) {
                if (scope.coordinates.x > scope.coordinates.xMax) {
                  scope.coordinates.x = scope.coordinates.xMax;
                }
                if (scope.coordinates.x < scope.coordinates.xMin) {
                  scope.coordinates.x = scope.coordinates.xMin;
                }
                if (scope.coordinates.y > scope.coordinates.yMax) {
                  scope.coordinates.y = scope.coordinates.yMax;
                }
                if (scope.coordinates.y < scope.coordinates.yMin) {
                  scope.coordinates.y = scope.coordinates.yMin;
                }
                scope.willingnessChart.data.datasets[0].data = [{
                  x: scope.coordinates.x,
                  y: scope.coordinates.y
                }];

                scope.willingnessChart.update();
              }
            });
          }
        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

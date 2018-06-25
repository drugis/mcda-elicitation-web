'use strict';
define(['c3', 'd3'],
  function(c3, d3) {
    var dependencies = [
      'mcdaRootPath',
      '$timeout'
    ];
    var WillingnessToTradeOffChartDirective = function(
      mcdaRootPath,
      $timeout
    ) {
      return {
        restrict: 'E',
        scope: {
          settings: '='
        },
        templateUrl: mcdaRootPath + 'js/preferences/willingnessToTradeOffChartDirective.html',
        link: function(scope, element) {
          scope.updateFirstPoint = updateFirstPoint;

          scope.coordinates = {};
          var chart;
          var data = {
            xs: { firstPoint: 'firstPoint_x' },
            columns: []
          };
          var root = d3.select($(element).get(0));
          root = root.select('svg');

          scope.$watch('settings', function(newSettings) {
            if (newSettings) {
              initChart(newSettings);
            }
          }, true);


          function initChart(newSettings) {
            root.append('rect')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', 'white');
            root
              .style('width', '500px')
              .style('height', '500px')
              .style('background', 'white');
            scope.coordinates = {};
            var minX = newSettings.firstCriterion.dataSources[0].pvf.range[0];
            var maxX = newSettings.firstCriterion.dataSources[0].pvf.range[1];
            var minY = newSettings.secondCriterion.dataSources[0].pvf.range[0];
            var maxY = newSettings.secondCriterion.dataSources[0].pvf.range[1];

            var chart = c3.generate({
              bindto: root,
              data: {
                xs: { firstPoint: 'firstPoint_x' },
                columns: []
              },
              type: 'scatter',
              axis: {
                x: {
                  ticks: 10,
                  min: minX,
                  max: maxX,
                  label: newSettings.firstCriterion.title,
                  padding: {
                    left: 0,
                    right: 0
                  }
                },
                y: {
                  ticks: 10,
                  min: minY,
                  max: maxY,
                  label: newSettings.secondCriterion.title,
                  padding: {
                    top: 0,
                    bottom: 0
                  }
                }
              }
            });


            // var background = root.select('.nv-focus .nv-background rect');
            chart.internal.main.on('click', clickHandler); // https://github.com/c3js/c3/issues/705

            function clickHandler() {
              var coords = d3.mouse(this);

              scope.coordinates.x = chart.internal.x.invert(coords[0]);
              scope.coordinates.y = chart.internal.y.invert(coords[1]);

              data.columns[0] = ['firstPoint', scope.coordinates.y];
              data.columns[1] = ['firstPoint_x', scope.coordinates.x];
              chart.load(data);
              $timeout(); // force coordinate update outside chart
            }

          }

          function updateFirstPoint() {
            if (scope.coordinates.x > -Infinity && scope.coordinates.y > -Infinity) {
              data.columns[0] = ['firstPoint', scope.coordinates.y];
              data.columns[1] = ['firstPoint_x', scope.coordinates.x];
              chart.load(data);
            }
          }

        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

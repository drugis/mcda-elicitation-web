'use strict';
define(['d3', 'nvd3'],
  function(d3, nvd3) {
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
          var firstPointData;
          var chart;
          var data;
          scope.updateFirstPoint = updateFirstPoint;

          scope.coordinates = {};

          var root = d3.select($(element).get(0));
          root = root.select('svg');

          scope.$watch('settings', function(newSettings) {
            if (newSettings) {
              initChart(newSettings);
            }
          }, true);


          function initChart(newSettings) {
            firstPointData = {
              values: [{x:0.5, y:0.6}]
            };
            var minX = newSettings.firstCriterion.dataSources[0].pvf.range[0];
            var maxX = newSettings.firstCriterion.dataSources[0].pvf.range[1];
            var minY = newSettings.secondCriterion.dataSources[0].pvf.range[0];
            var maxY = newSettings.secondCriterion.dataSources[0].pvf.range[1];
            chart = nvd3.models.lineChart()
              .showLegend(true)
              .useInteractiveGuideline(true)
              .color(d3.scale.category10().range())
              .xDomain([minX, maxX])
              .yDomain([maxY, minY]);
            //Axis settings
            chart.xAxis.axisLabel(newSettings.firstCriterion.title);
            chart.yAxis.axisLabel(newSettings.secondCriterion.title);
            chart.xAxis.tickFormat(d3.format('.02f'));
            chart.yAxis.tickFormat(d3.format('.02f'));
            data = [{
              values: [
                { x: 0.1, y: 0.8 },
                { x: 0.5, y: 0.5 },
                { x: 0.7, y: 0.2 },
              ]
            }, firstPointData];
            root.append('rect')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', 'white');

            root
              .style('width', '500px')
              .style('height', '500px')
              .style('background', 'white')
              .datum(data)
              .call(chart);

            var background = root.select('.nv-focus .nv-background rect');
            background.on('click', clickHandler);

            function clickHandler() {

              var coords = d3.mouse(this);

              var xScale = chart.xAxis.scale();
              var yScale = chart.yAxis.scale();
              firstPointData.values[0] = {
                x: xScale.invert(coords[0]),  // Takes the pixel number to convert to number
                y: yScale.invert(coords[1])
              };
              scope.coordinates = firstPointData.values[0];
              $timeout(function() {
                chart.update();
              });
            }

          }

          function updateFirstPoint() {
            firstPointData.values = scope.coordinates;
            $timeout(function() {
              chart.update();
            });
          }

        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

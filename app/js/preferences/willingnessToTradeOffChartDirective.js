'use strict';
define(['c3', 'd3'],
  function(c3, d3) {
    var dependencies = [
      'TradeoffService',
      'mcdaRootPath',
      '$timeout'
    ];
    var WillingnessToTradeOffChartDirective = function(
      TradeoffService,
      mcdaRootPath,
      $timeout
    ) {
      return {
        restrict: 'E',
        scope: {
          problem: '=',
          settings: '='
        },
        templateUrl: mcdaRootPath + 'js/preferences/willingnessToTradeOffChartDirective.html',
        link: function(scope, element) {
          scope.updateFirstPoint = updateFirstPoint;

          scope.coordinates = {};
          var criteria;

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
              criteria = {
                firstCriterion: newSettings.firstCriterion,
                secondCriterion: newSettings.secondCriterion
              };
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

            chart = c3.generate({
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

            chart.internal.main.on('click', clickHandler); // https://github.com/c3js/c3/issues/705

            function clickHandler() {
              var coords = d3.mouse(this);
              scope.coordinates.x = chart.internal.x.invert(coords[0]);
              scope.coordinates.y = chart.internal.y.invert(coords[1]);
              updateCoordinates();
              TradeoffService.getIndifferenceCurve(scope.problem, scope.criteria, scope.coordinates).then(function(results) {
                plotIndifference(results);
              });
              $timeout(); // force coordinate update outside chart
            }
          }

          function plotIndifference(results){
            //FIXME
          }

          function updateFirstPoint() {
            if (scope.coordinates.x > -Infinity && scope.coordinates.y > -Infinity) {
              updateCoordinates();
            }
          }

          function updateCoordinates() {
            data.columns[0] = ['firstPoint', scope.coordinates.y];
            data.columns[1] = ['firstPoint_x', scope.coordinates.x];
            chart.load(data);
          }

        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

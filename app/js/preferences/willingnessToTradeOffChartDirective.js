'use strict';
define(['c3', 'd3', 'jquery'],
  function(c3, d3, $) {
    var dependencies = [
      'TradeOffService',
      '$timeout'
    ];
    var WillingnessToTradeOffChartDirective = function(
      TradeOffService,
      $timeout
    ) {
      return {
        restrict: 'E',
        scope: {
          problem: '=',
          settings: '='
        },
        templateUrl: './willingnessToTradeOffChartDirective.html',
        link: function(scope, element) {
          scope.updateFirstPoint = updateFirstPoint;
          scope.updateSecondPoint = updateSecondPoint;

          // init

          scope.coordinates = {};
          scope.sliderOptions = {
            precision: 4,
            onChange: updateSecondPoint
          };

          var criteria;
          var chart;
          var data = {
            xs: {
              firstPoint: 'firstPoint_x',
              line: 'line_x',
              secondPoint: 'secondPoint_x'
            },
            columns: [],
            type: 'scatter',
            types: {
              line: 'line'
            },
            names: {
              firstPoint: 'Outcome A',
              line: 'Indifference curve',
              secondPoint: 'Ouctome B'
            }
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

          // puublic functions

          function updateFirstPoint() {
            if (scope.coordinates.x > -Infinity && scope.coordinates.y > -Infinity) {
              scope.coordinates.x = scope.coordinates.x < scope.sliderOptions.floor ? scope.sliderOptions.floor : scope.coordinates.x;
              scope.coordinates.x = scope.coordinates.x > scope.sliderOptions.ceil ? scope.sliderOptions.ceil : scope.coordinates.x;
              scope.coordinates.y = scope.coordinates.y < scope.minY ? scope.minY : scope.coordinates.y;
              scope.coordinates.y = scope.coordinates.y > scope.maxY ? scope.maxY : scope.coordinates.y;
              updateCoordinates();
            }
          }

          function updateSecondPoint() {
            scope.sliderOptions.minLimit = data.columns[2][1];
            scope.sliderOptions.maxLimit = data.columns[2][data.columns[2].length-1];
            var secondPointCoordinates = TradeOffService.getYValue(scope.coordinates.x2, data.columns[2], data.columns[3]);
            data.columns[4] = ['secondPoint_x', secondPointCoordinates.x];
            data.columns[5] = ['secondPoint', secondPointCoordinates.y];
            scope.coordinates.x2 = secondPointCoordinates.x;
            scope.coordinates.y2 = secondPointCoordinates.y;

            $timeout(function() {
              scope.$broadcast('rzSliderForceRender');
            }, 100);
            chart.load(data);
          }

          // private

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
            scope.sliderOptions.floor = TradeOffService.significantDigits(newSettings.firstCriterion.dataSources[0].pvf.range[0]);
            scope.sliderOptions.ceil = TradeOffService.significantDigits(newSettings.firstCriterion.dataSources[0].pvf.range[1]);
            scope.sliderOptions.step = TradeOffService.significantDigits((scope.sliderOptions.ceil - scope.sliderOptions.floor) / 100);
            scope.coordinates.x2 = scope.sliderOptions.floor;
            scope.minY = newSettings.secondCriterion.dataSources[0].pvf.range[0];
            scope.maxY = newSettings.secondCriterion.dataSources[0].pvf.range[1];

            var initialSettings = TradeOffService.getInitialSettings(root, data, scope.sliderOptions, newSettings, scope.minY, scope.maxY);
            initialSettings.data.columns = [];
            chart = c3.generate(initialSettings);

            chart.internal.main.on('click', clickHandler); // https://github.com/c3js/c3/issues/705

            function clickHandler() {
              var coords = d3.mouse(this);
              scope.coordinates.x = TradeOffService.significantDigits(chart.internal.x.invert(coords[0]));
              scope.coordinates.y = TradeOffService.significantDigits(chart.internal.y.invert(coords[1]));
              updateCoordinates();
              $timeout(); // force coordinate update outside chart
            }
          }

          function plotIndifference(results) {
            data.columns[2] = (['line_x'].concat(results.data.x));
            data.columns[3] = (['line'].concat(results.data.y));
          }

          function updateCoordinates() {
            data.columns[0] = ['firstPoint', scope.coordinates.y];
            data.columns[1] = ['firstPoint_x', scope.coordinates.x];
            chart.load(data);
            TradeOffService.getIndifferenceCurve(scope.problem, criteria, scope.coordinates).then(function(results) {
              plotIndifference(results);
              chart.load(data);
              updateSecondPoint();
            });
          }
        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

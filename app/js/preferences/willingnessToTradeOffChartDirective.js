'use strict';
define(['c3', 'd3', 'lodash'],
  function(c3, d3, _) {
    var dependencies = [
      '$timeout',
      'TradeOffService',
      'significantDigits'
    ];
    var WillingnessToTradeOffChartDirective = function(
      $timeout,
      TradeOffService,
      significantDigits
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
          scope.updateInputFirstPoint = updateInputFirstPoint;
          scope.updateInputSecondPoint = updateInputSecondPoint;

          // init
          scope.coordinates = {};
          scope.sliderOptions = {
            precision: 4,
            onChange: updateSecondPoint,
            translate: significantDigits
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
              secondPoint: 'Outcome B'
            }
          };
          var root = d3.select(element[0]);
          root = root.select('.graph-root');

          scope.$watch('settings', function(newSettings) {
            if (newSettings && newSettings.firstCriterion.dataSources[0].pvf.range) {
              initChart(newSettings);
              criteria = {
                firstCriterion: newSettings.firstCriterion,
                secondCriterion: newSettings.secondCriterion
              };
            }
          }, true);

          scope.$on('elicit.settingsChanged', function() {
            updateFirstPoint();
            updateAxisLabels();
          });

          function updateInputFirstPoint() {
            scope.coordinates.x = significantDigits(scope.inputCoordinates.x);
            scope.coordinates.y = significantDigits(scope.inputCoordinates.y);
            updateFirstPoint();
          }

          function updateFirstPoint() {
            scope.areCoordinatesSet = TradeOffService.areCoordinatesSet(scope.coordinates);
            if (scope.areCoordinatesSet) {
              scope.coordinates.x = _.clamp(scope.coordinates.x, scope.sliderOptions.floor, scope.sliderOptions.ceil);
              scope.coordinates.y = _.clamp(scope.coordinates.y, scope.minY, scope.maxY);
              scope.inputCoordinates = {
                x: significantDigits(scope.coordinates.x),
                y: significantDigits(scope.coordinates.y)
              };
              redrawPlot();
            }
          }

          function redrawPlot() {
            data.columns[0] = ['firstPoint', scope.coordinates.y];
            data.columns[1] = ['firstPoint_x', scope.coordinates.x];
            chart.load(data);
            TradeOffService.getIndifferenceCurve(scope.problem, criteria, scope.coordinates).then(function(results) {
              plotIndifference(results);
              chart.load(data);
              updateSecondPoint();
            });
          }

          function updateInputSecondPoint() {
            scope.coordinates.x2 = significantDigits(scope.inputCoordinates.x2);
            scope.coordinates.y2 = significantDigits(scope.inputCoordinates.y2);
            updateSecondPoint();
          }

          function updateSecondPoint() {
            scope.sliderOptions.minLimit = data.columns[2][1];
            scope.sliderOptions.maxLimit = data.columns[2][data.columns[2].length - 1];
            var secondPointCoordinates = TradeOffService.getYValue(scope.coordinates.x2, data.columns[2], data.columns[3]);
            data.columns[4] = ['secondPoint_x', secondPointCoordinates.x];
            data.columns[5] = ['secondPoint', secondPointCoordinates.y];
            scope.coordinates.x2 = secondPointCoordinates.x;
            scope.coordinates.y2 = secondPointCoordinates.y;
            scope.inputCoordinates.x2 = significantDigits(scope.coordinates.x2);
            scope.inputCoordinates.y2 = significantDigits(scope.coordinates.y2);

            $timeout(function() {
              scope.$broadcast('rzSliderForceRender');
            }, 100);
            chart.load(data);
          }

          function initChart(newSettings) {
            scope.areCoordinatesSet = false;
            scope.inputCoordinates = {};
            root.append('rect')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', 'white');
            root
              .style('width', '500px')
              .style('height', '500px')
              .style('background', 'white');
            scope.coordinates = {};
            scope.sliderOptions.floor = significantDigits(newSettings.firstCriterion.dataSources[0].pvf.range[0]);
            scope.sliderOptions.ceil = significantDigits(newSettings.firstCriterion.dataSources[0].pvf.range[1]);
            scope.sliderOptions.step = significantDigits((scope.sliderOptions.ceil - scope.sliderOptions.floor) / 100);
            scope.coordinates.x2 = scope.sliderOptions.floor;
            scope.minY = newSettings.secondCriterion.dataSources[0].pvf.range[0];
            scope.maxY = newSettings.secondCriterion.dataSources[0].pvf.range[1];

            var coordRanges = {
              minX: scope.sliderOptions.floor,
              maxX: scope.sliderOptions.ceil,
              minY: scope.minY,
              maxY: scope.maxY
            };

            var initialSettings = TradeOffService.getInitialSettings(root, data, coordRanges, newSettings);
            initialSettings.data.columns = [];

            scope.units = {
              x: scope.settings.firstCriterion.dataSources[0].unitOfMeasurement,
              y: scope.settings.secondCriterion.dataSources[0].unitOfMeasurement
            };

            chart = c3.generate(initialSettings);

            chart.internal.main.on('click', clickHandler); // https://github.com/c3js/c3/issues/705

            function clickHandler() {
              var coords = d3.mouse(this);
              scope.coordinates.x = significantDigits(chart.internal.x.invert(coords[0]));
              scope.coordinates.y = significantDigits(chart.internal.y.invert(coords[1]));
              updateFirstPoint();
              $timeout(); // force coordinate update outside chart
            }
          }

          function plotIndifference(results) {
            data.columns[2] = ['line_x'].concat(results.x);
            data.columns[3] = ['line'].concat(results.y);
          }

          function updateAxisLabels() {
            scope.units = {
              x: scope.settings.firstCriterion.dataSources[0].unitOfMeasurement.label,
              y: scope.settings.secondCriterion.dataSources[0].unitOfMeasurement.label
            };
            chart.axis.labels(scope.units);
          }
        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

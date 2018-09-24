'use strict';
define(['c3', 'd3', 'jquery', 'lodash'],
  function(c3, d3, $, _) {
    var dependencies = [
      '$timeout',
      'TradeOffService',
      'WorkspaceSettingsService',
      'significantDigits'
    ];
    var WillingnessToTradeOffChartDirective = function(
      $timeout,
      TradeOffService,
      WorkspaceSettingsService,
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
            translate: function(value) {
              var multiplier = 1;
              if (usePercentage(scope.settings.firstCriterion.dataSources[0].scale)) {
                multiplier = 100;
              }
              return significantDigits(value * multiplier);
            }
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
          var root = d3.select($(element).get(0));
          root = root.select('svg');

          scope.$watch('settings', function(newSettings) {
            if (newSettings && newSettings.firstCriterion.dataSources[0].pvf.range) {
              updatePercentageModifier();
              initChart(newSettings);
              criteria = {
                firstCriterion: newSettings.firstCriterion,
                secondCriterion: newSettings.secondCriterion
              };
            }
          }, true);

          scope.$on('elicit.settingsChanged', function() {
            updatePercentageModifier();
            updateFirstPoint();
            updateAxisLabels();
          });

          function updatePercentageModifier() {
            scope.percentageModifiers = {
              firstCriterion: usePercentage(scope.settings.firstCriterion.dataSources[0].scale) ? 100 : 1,
              secondCriterion: usePercentage(scope.settings.secondCriterion.dataSources[0].scale) ? 100 : 1
            };
          }

          function usePercentage(scale) {
            return _.isEqual([0, 1], scale) && WorkspaceSettingsService.usePercentage();
          }

          function updateInputFirstPoint() {
            scope.coordinates.x = significantDigits(scope.inputCoordinates.x / scope.percentageModifiers.firstCriterion);
            scope.coordinates.y = significantDigits(scope.inputCoordinates.y / scope.percentageModifiers.secondCriterion);
            updateFirstPoint();
          }

          function updateFirstPoint() {
            scope.areCoordinatesSet = TradeOffService.areCoordinatesSet(scope.coordinates);
            if (scope.areCoordinatesSet) {
              scope.coordinates.x = _.clamp(scope.coordinates.x, scope.sliderOptions.floor, scope.sliderOptions.ceil);
              scope.coordinates.y = _.clamp(scope.coordinates.y, scope.minY, scope.maxY);
              scope.inputCoordinates = {
                x: significantDigits(scope.coordinates.x * scope.percentageModifiers.firstCriterion),
                y: significantDigits(scope.coordinates.y * scope.percentageModifiers.secondCriterion)
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
            scope.coordinates.x2 = significantDigits(scope.inputCoordinates.x2 / scope.percentageModifiers.firstCriterion);
            scope.coordinates.y2 = significantDigits(scope.inputCoordinates.y2 / scope.percentageModifiers.secondCriterion);
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
            scope.inputCoordinates.x2 = significantDigits(scope.coordinates.x2 * scope.percentageModifiers.firstCriterion);
            scope.inputCoordinates.y2 = significantDigits(scope.coordinates.y2 * scope.percentageModifiers.secondCriterion);

            $timeout(function() {
              scope.$broadcast('rzSliderForceRender');
            }, 100);
            chart.load(data);
          }

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
            scope.sliderOptions.floor = significantDigits(newSettings.firstCriterion.dataSources[0].pvf.range[0]);
            scope.sliderOptions.ceil = significantDigits(newSettings.firstCriterion.dataSources[0].pvf.range[1]);
            scope.sliderOptions.step = significantDigits((scope.sliderOptions.ceil - scope.sliderOptions.floor) / 100);
            scope.coordinates.x2 = scope.sliderOptions.floor;
            scope.minY = newSettings.secondCriterion.dataSources[0].pvf.range[0];
            scope.maxY = newSettings.secondCriterion.dataSources[0].pvf.range[1];

            var initialSettings = TradeOffService.getInitialSettings(root, data, scope.sliderOptions, newSettings, scope.minY, scope.maxY);
            initialSettings.data.columns = [];

            scope.units = {
              x: initialSettings.axis.x.label,
              y: initialSettings.axis.y.label
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
            data.columns[2] = (['line_x'].concat(results.data.x));
            data.columns[3] = (['line'].concat(results.data.y));
          }

          function updateAxisLabels() {
            scope.units = {
              x: TradeOffService.getLabel(scope.settings.firstCriterion),
              y: TradeOffService.getLabel(scope.settings.secondCriterion)
            };
            chart.axis.labels(scope.units);
          }
        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });

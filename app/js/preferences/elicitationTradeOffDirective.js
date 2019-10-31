'use strict';
define(['lodash', 'd3', 'c3'],
  function(_, d3, c3) {
    var dependencies = [
      '$timeout',
      'PartialValueFunctionService',
      'TradeOffService',
      'significantDigits'
    ];
    var PreferenceElicitationRow = function(
      $timeout,
      PartialValueFunctionService,
      TradeOffService,
      significantDigits
    ) {
      return {
        restrict: 'E',
        scope: {
          mostImportantCriterion: '=',
          secondaryCriterion: '=',
          weight: '='
        },
        templateUrl: './elicitationTradeOffDirective.html',
        link: function(scope, element) {
          var root, data, chart;
          var minX = scope.secondaryCriterion.dataSources[0].pvf.range[0];
          var maxX = scope.secondaryCriterion.dataSources[0].pvf.range[1];
          var minY = scope.mostImportantCriterion.dataSources[0].pvf.range[0];
          var maxY = scope.mostImportantCriterion.dataSources[0].pvf.range[1];
          scope.pvf = PartialValueFunctionService;

          scope.plotIndifference = plotIndifference;

          $timeout(init);

          function init() {
            root = d3.select(element[0]);
            root = root.select('#tradeOffPlot');
            data = {
              xs: {
                line: 'line_x'
              },
              columns: [],
              type: 'line',
            };

            if (scope.mostImportantCriterion.hasOwnProperty('isFavorable') &&
              !scope.mostImportantCriterion.isFavorable
            ) {
              setUnfavorableValues();
            } else {
              setDefaultValues();
            }

            scope.sliderOptions = {
              precision: 4,
              onEnd: plotIndifference,
              translate: significantDigits,
              floor: significantDigits(minY),
              ceil: significantDigits(maxY)
            };
            scope.sliderOptions.step = significantDigits((maxY - minY) / 50);

            initChart();
            plotIndifference();
          }

          function setUnfavorableValues() {
            scope.mostImportantCriterionValue = {
              firstValue: scope.mostImportantCriterion.best,
              secondValue: scope.mostImportantCriterion.worst
            };
            scope.secondaryCriterionValue = {
              firstValue: scope.secondaryCriterion.worst,
              secondValue: scope.secondaryCriterion.best
            };
            scope.question = 'How much worse is ' + scope.mostImportantCriterion.title +
              ' maximally allowed to get to justify the improvement of ' + scope.secondaryCriterion.title + '?';

          }

          function setDefaultValues() {
            scope.mostImportantCriterionValue = {
              firstValue: scope.mostImportantCriterion.worst,
              secondValue: scope.mostImportantCriterion.best
            };
            scope.secondaryCriterionValue = {
              firstValue: scope.secondaryCriterion.best,
              secondValue: scope.secondaryCriterion.worst
            };
            scope.question = 'How much better should ' + scope.mostImportantCriterion.title +
              ' minimally become to justify the worsening of ' + scope.secondaryCriterion.title + '?';
          }

          function initChart() {
            scope.areCoordinatesSet = false;
            scope.inputCoordinates = {};
            root.append('rect')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', 'white');
            root
              .style('width', '300px')
              .style('height', '300px')
              .style('background', 'white');

            var coordRanges = {
              minX: minX,
              maxX: maxX,
              minY: minY,
              maxY: maxY
            };

            var criteria = {
              firstCriterion: scope.secondaryCriterion,
              secondCriterion: scope.mostImportantCriterion
            };

            var initialSettings = TradeOffService.getInitialSettings(root, data, coordRanges, criteria);
            initialSettings.data.columns = [];
            initialSettings.legend.show = false;
            initialSettings.axis.x.tick.count = 5;
            initialSettings.axis.y.tick.count = 5;

            scope.units = {
              x: scope.secondaryCriterion.dataSources[0].unitOfMeasurement.label,
              y: scope.mostImportantCriterion.dataSources[0].unitOfMeasurement.label
            };

            chart = c3.generate(initialSettings);
          }

          function plotIndifference() {
            scope.showSlider = false;
            TradeOffService.getElicitationTradeOffCurve(
              scope.mostImportantCriterion,
              scope.secondaryCriterion,
              scope.mostImportantCriterionValue.secondValue
            ).then(function(results) {
              data.columns[0] = ['line_x'].concat(results.data.x);
              data.columns[1] = ['line'].concat(results.data.y);
              chart.load(data);
              scope.weight.value = results.weight;
            });
          }

        }
      };
    };
    return dependencies.concat(PreferenceElicitationRow);
  });

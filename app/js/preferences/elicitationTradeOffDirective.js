'use strict';
define(['lodash', 'd3', 'c3'],
  function(_, d3, c3) {
    var dependencies = [
      '$timeout',
      'PartialValueFunctionService',
      'WorkspaceSettingsService',
      'TradeOffService',
      'significantDigits'
    ];
    var PreferenceElicitationRow = function(
      $timeout,
      PartialValueFunctionService,
      WorkspaceSettingsService,
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

            if (scope.mostImportantCriterion.hasOwnProperty('favorability') &&
              !scope.mostImportantCriterion.favorability
            ) {
              scope.mostImportantCriterionValue = { value: scope.mostImportantCriterion.best };
              scope.secondaryCriterionValue = minX;
              scope.question = 'How much worse is this maximally allowed to get to justify the improvement of the second criterion?';
            } else {
              scope.mostImportantCriterionValue = { value: scope.mostImportantCriterion.worst };
              scope.secondaryCriterionValue = maxX;
              scope.question = 'How much improvement should there minimally be to justify the worsening of the second criterion?';
            }

            scope.sliderOptions = {
              precision: 4,
              onEnd: plotIndifference,
              translate: function(value) {
                var multiplier = 1;
                if (usePercentage(scope.mostImportantCriterion.dataSources[0].scale)) {
                  multiplier = 100;
                }
                return significantDigits(value * multiplier);
              },
              floor: significantDigits(minY),
              ceil: significantDigits(maxY)
            };
            scope.sliderOptions.step = significantDigits((maxY - minY) / 100);

            initChart();
            plotIndifference();
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
              x: TradeOffService.getUnit(scope.secondaryCriterion),
              y: TradeOffService.getUnit(scope.mostImportantCriterion)
            };

            chart = c3.generate(initialSettings);
          }

          function usePercentage(scale) {
            return _.isEqual([0, 1], scale) && WorkspaceSettingsService.usePercentage();
          }

          function plotIndifference() {
            scope.showSlider = false;
            TradeOffService.getElicitationTradeOffCurve(
              scope.mostImportantCriterion,
              scope.secondaryCriterion,
              scope.mostImportantCriterionValue.value
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

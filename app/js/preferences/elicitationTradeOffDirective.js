'use strict';
define([],
  function() {
    var dependencies = [
      'TradeOffService',
      'significantDigits'
    ];
    var ElicitationTradeOffDirective = function(
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
        link: function(scope) {
          var minX = scope.secondaryCriterion.dataSources[0].pvf.range[0];
          var maxX = scope.secondaryCriterion.dataSources[0].pvf.range[1];
          var minY = scope.mostImportantCriterion.dataSources[0].pvf.range[0];
          var maxY = scope.mostImportantCriterion.dataSources[0].pvf.range[1];

          init();

          function init() {
            setCriterionValues();
            setScopeValues();
            getPlotValues();
          }

          function setCriterionValues() {
            if (scope.mostImportantCriterion.hasOwnProperty('isFavorable') &&
              !scope.mostImportantCriterion.isFavorable
            ) {
              setUnfavorableValues();
            } else {
              setDefaultValues();
            }
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

          function setScopeValues() {
            scope.sliderOptions = {
              precision: 3,
              onEnd: getPlotValues,
              translate: significantDigits,
              floor: significantDigits(minY),
              ceil: significantDigits(maxY),
              step: significantDigits((maxY - minY) / 50)
            };
            scope.areCoordinatesSet = false;
            scope.inputCoordinates = {};
            scope.coordRanges = {
              minX: minX,
              maxX: maxX,
              minY: minY,
              maxY: maxY
            };
            scope.criteria = {
              firstCriterion: scope.secondaryCriterion,
              secondCriterion: scope.mostImportantCriterion
            };
          }

          function getPlotValues() {
            scope.showSlider = false;
            delete scope.weight.value;
            TradeOffService.getElicitationTradeOffCurve(
              scope.mostImportantCriterion,
              scope.secondaryCriterion,
              scope.mostImportantCriterionValue.secondValue
            ).then(function(results) {
              scope.data = createData(results);
              scope.weight.value = results.weight;
            });
          }

          function createData(results) {
            return {
              xs: { line: 'line_x' },
              columns: [
                ['line_x'].concat(results.data.x),
                ['line'].concat(results.data.y)
              ],
              type: 'line',
            };
          }
        }
      };
    };
    return dependencies.concat(ElicitationTradeOffDirective);
  });

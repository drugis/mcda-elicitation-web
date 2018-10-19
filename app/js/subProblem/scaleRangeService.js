'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [
    'intervalHull',
    'numberFilter',
    'WorkspaceSettingsService'
  ];

  var ScaleRangeService = function(
    intervalHull,
    numberFilter,
    WorkspaceSettingsService
  ) {
    function log10(x) {
      return Math.log(x) / Math.log(10);
    }

    function nice(x, dirFun) {
      if (x === 0) {
        return 0;
      }
      var absX = Math.abs(x);
      var log10X = log10(absX);
      var factor;
      var normalised;
      var ceiled;
      var deNormalised;
      if (absX >= 1) {
        factor = Math.floor(log10X);
        normalised = x / Math.pow(10, factor);
        ceiled = dirFun(normalised);
        deNormalised = ceiled * Math.pow(10, factor);
      } else {
        factor = Math.ceil(Math.abs(log10X));
        normalised = x * Math.pow(10, factor);
        ceiled = dirFun(normalised);
        deNormalised = ceiled * Math.pow(10, -factor);
      }
      return deNormalised;
    }

    function niceTo(x) {
      return nice(x, Math.ceil);
    }

    function niceFrom(x) {
      return nice(x, Math.floor);
    }

    function calculateScales(dataSourceScale, from, to, criterionRange, shouldCalcPercentage) {
      var scale = dataSourceScale || [null, null];
      var boundFrom = function(val) {
        return val < scale[0] ? scale[0] : val;
      };
      var boundTo = function(val) {
        return val > scale[1] ? scale[1] : val;
      };
      var margin = 0.5 * (to - from);

      scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
      scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

      return {
        increaseFrom: function() {
          this.sliderOptions.floor = niceFrom(boundFrom(this.sliderOptions.floor - margin));
        },
        increaseTo: function() {
          this.sliderOptions.ceil = niceTo(boundTo(this.sliderOptions.ceil + margin));
        },
        sliderOptions: {
          restrictedRange: {
            from: criterionRange[0],
            to: criterionRange[1]
          },
          floor: niceFrom(from),
          ceil: niceTo(to),
          step: Math.abs(niceTo(to) - niceFrom(from)) / 100,
          precision: 4,
          noSwitching: true,
          translate: function(value) {
            return numberFilter(shouldCalcPercentage ? value * 100 : value);
          }
        }
      };
    }

    function createRanges(choices) {
      return _.fromPairs(_.map(choices, function(choice, criterionId) {
        return [criterionId, {
          pvf: {
            range: [choice.from, choice.to]
          }
        }];
      }));
    }

    function getScalesStateAndChoices(observedScales, criteria) {
      return _.reduce(criteria, function(accum, criterion) {
        return _.merge({}, accum, initializeScaleStateAndChoicesForCriterion(observedScales, criterion));
      }, {});
    }

    function initializeScaleStateAndChoicesForCriterion(observedScales, criterion) {
      var showPercentage = WorkspaceSettingsService.usePercentage();
      return _.reduce(criterion.dataSources, function(accum, dataSource) {
        // Calculate interval hulls
        var dataSourceRange = intervalHull(observedScales[dataSource.id]);
        var pvf = dataSource.pvf;
        var problemRange = pvf ? pvf.range : null;
        var from = problemRange ? problemRange[0] : dataSourceRange[0];
        var to = problemRange ? problemRange[1] : dataSourceRange[1];

        // Set scales for slider
        var dataSourceScale = dataSource.scale;
        var shouldCalcPercentage = _.isEqual([0, 1], dataSourceScale) && showPercentage;
        accum.scalesState[dataSource.id] = calculateScales(dataSourceScale, from, to, dataSourceRange, shouldCalcPercentage);

        // Set inital model value
        accum.choices[dataSource.id] = {
          from: Math.min(niceFrom(from), accum.scalesState[dataSource.id].sliderOptions.restrictedRange.from),
          to: Math.max(niceTo(to), accum.scalesState[dataSource.id].sliderOptions.restrictedRange.to)
        };
        return accum;
      }, {
          scalesState: {},
          choices: {}
        }
      );
    }
    return {
      nice: nice,
      niceTo: niceTo,
      niceFrom: niceFrom,
      calculateScales: calculateScales,
      createRanges: createRanges,
      getScalesStateAndChoices: getScalesStateAndChoices
    };
  };

  return dependencies.concat(ScaleRangeService);
});

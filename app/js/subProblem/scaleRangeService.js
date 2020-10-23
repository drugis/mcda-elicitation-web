'use strict';
define(['lodash'], function (_) {
  var dependencies = [
    'PerformanceTableService',
    'intervalHull',
    'numberFilter'
  ];

  var ScaleRangeService = function (
    PerformanceTableService,
    intervalHull,
    numberFilter
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

    function calculateScales(scale, from, to, criterionRange) {
      var boundFrom = function (val) {
        return val < scale[0] ? scale[0] : val;
      };

      var boundTo = function (val) {
        return val > scale[1] ? scale[1] : val;
      };

      if (from === to) {
        from *= 0.95;
        to *= 1.05;
      }

      scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
      scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

      var restrictedRangeFrom = criterionRange[0];
      var restrictedRangeTo = criterionRange[1];
      if (restrictedRangeFrom === restrictedRangeTo) {
        // dumb corner case
        restrictedRangeFrom -= Math.abs(restrictedRangeFrom) * 0.001;
        restrictedRangeTo += Math.abs(restrictedRangeTo) * 0.001;
      }
      var floor = getFloor(from, restrictedRangeFrom);
      var ceil = getCeil(to, restrictedRangeTo);

      var margin = getMargin(from, to);

      return {
        increaseFrom: function () {
          this.sliderOptions.floor = niceFrom(
            boundFrom(this.sliderOptions.floor - margin)
          );
        },
        increaseTo: function () {
          this.sliderOptions.ceil = niceTo(
            boundTo(this.sliderOptions.ceil + margin)
          );
        },
        sliderOptions: {
          restrictedRange: {
            from: restrictedRangeFrom,
            to: restrictedRangeTo
          },
          floor: floor,
          ceil: ceil,
          step: Math.abs(niceTo(to) - niceFrom(from)) / 100,
          precision: 4,
          noSwitching: true,
          translate: function (value) {
            return numberFilter(value);
          }
        }
      };
    }

    function getFloor(from, restrictedRangeFrom) {
      var floor = niceFrom(from);
      if (floor >= restrictedRangeFrom) {
        floor = niceFrom(floor - Math.abs(floor * 0.1));
      }
      return floor;
    }

    function getCeil(to, restrictedRangeTo) {
      var ceil = niceTo(to);
      if (ceil <= restrictedRangeTo) {
        ceil = niceTo(ceil + Math.abs(ceil * 0.1));
      }
      return ceil;
    }

    function getMargin(from, to) {
      return 0.5 * (to - from);
    }

    function getScalesStateAndChoices(
      observedScales,
      criteria,
      performanceTable
    ) {
      return _.reduce(
        criteria,
        function (accum, criterion) {
          return _.merge(
            {},
            accum,
            initializeScaleStateAndChoicesForCriterion(
              observedScales,
              criterion,
              performanceTable
            )
          );
        },
        {}
      );
    }

    function initializeScaleStateAndChoicesForCriterion(
      observedScales,
      criterion,
      performanceTable
    ) {
      return _.reduce(
        criterion.dataSources,
        function (accum, dataSource) {
          // Calculate interval hulls
          var effectValues = PerformanceTableService.getEffectValues(
            performanceTable,
            dataSource
          );
          var dataSourceRange = intervalHull(
            observedScales[dataSource.id],
            effectValues
          );
          var pvf = dataSource.pvf;
          var problemRange = pvf ? pvf.range : null;
          var from = problemRange ? problemRange[0] : dataSourceRange[0];
          var to = problemRange ? problemRange[1] : dataSourceRange[1];

          if (from === 0 && to === 0) {
            to = 0.001;
            dataSourceRange[1] = 0.001;
          }

          // Set scales for slider
          var dataSourceScale = dataSource.scale;
          accum.scalesState[dataSource.id] = calculateScales(
            dataSourceScale,
            from,
            to,
            dataSourceRange
          );

          // Set inital model value
          accum.choices[dataSource.id] = {
            from: getFloor(
              from,
              accum.scalesState[dataSource.id].sliderOptions.restrictedRange
                .from
            ),
            to: getCeil(
              to,
              accum.scalesState[dataSource.id].sliderOptions.restrictedRange.to
            )
          };
          return accum;
        },
        {
          scalesState: {},
          choices: {}
        }
      );
    }

    return {
      niceTo: niceTo,
      niceFrom: niceFrom,
      calculateScales: calculateScales,
      getScalesStateAndChoices: getScalesStateAndChoices
    };
  };

  return dependencies.concat(ScaleRangeService);
});

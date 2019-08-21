'use strict';
define(['lodash', 'angular'], function(_, angular) {
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
      if (from === to) {
        from *= 0.95;
        to *= 1.1;
      }
      var margin = getMargin(from, to);

      scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
      scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

      var restrictedRangeFrom = criterionRange[0];
      var restrictedRangeTo = criterionRange[1];
      if (restrictedRangeFrom === restrictedRangeTo) {
        restrictedRangeFrom -= Math.abs(restrictedRangeFrom) * 0.001;
        restrictedRangeTo += Math.abs(restrictedRangeTo) * 0.001;
      }

      return {
        increaseFrom: function() {
          this.sliderOptions.floor = niceFrom(boundFrom(this.sliderOptions.floor - margin));
        },
        increaseTo: function() {
          this.sliderOptions.ceil = niceTo(boundTo(this.sliderOptions.ceil + margin));
        },
        sliderOptions: {
          restrictedRange: {
            from: restrictedRangeFrom,
            to: restrictedRangeTo
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

    function getMargin(from, to) {
      return 0.5 * (to - from);
    }

    function getScalesStateAndChoices(observedScales, criteria, performanceTable) {
      return _.reduce(criteria, function(accum, criterion) {
        return _.merge({}, accum, initializeScaleStateAndChoicesForCriterion(observedScales, criterion, performanceTable));
      }, {});
    }

    function initializeScaleStateAndChoicesForCriterion(observedScales, criterion, performanceTable) {
      var showPercentage = WorkspaceSettingsService.usePercentage();
      return _.reduce(criterion.dataSources, function(accum, dataSource) {
        // Calculate interval hulls
        var effectValues = getEffectValues(performanceTable, dataSource.id);
        var dataSourceRange = intervalHull(observedScales[dataSource.id], effectValues);
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

    function getScaleTable(table, scales, performanceTable) {
      var scaleTable = _.reject(table, 'isHeaderRow');
      return _.map(scaleTable, function(row) {
        var newRow = angular.copy(row);
        if (scales && scales.observed) {
          var effects = getEffectValues(performanceTable, row.dataSource);
          newRow.intervalHull = intervalHull(scales.observed[row.dataSource.id], effects);
        }
        return newRow;
      });
    }

    function getEffectValues(performanceTable, dataSource) {
      return _.reduce(performanceTable, function(accum, entry) {
        if (entry.dataSource === dataSource.id && entry.performance.effect) {
          var factor = dataSource.unitOfMeasurement.type === 'percentage' ? 100 : 1;
          accum.push(entry.performance.effect.value * factor);
        }
        return accum;
      }, []);
    }

    return {
      nice: nice,
      niceTo: niceTo,
      niceFrom: niceFrom,
      calculateScales: calculateScales,
      getScalesStateAndChoices: getScalesStateAndChoices,
      getScaleTable: getScaleTable
    };
  };

  return dependencies.concat(ScaleRangeService);
});

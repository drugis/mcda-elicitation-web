'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [
    'intervalHull',
    'numberFilter'
  ];

  var ScaleRangeService = function(
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


    function calculateScales(dataSourceScale, from, to, criterionRange) {
      var boundFrom = function(val) {
        return val < scale[0] ? scale[0] : val;
      };
      var boundTo = function(val) {
        return val > scale[1] ? scale[1] : val;
      };
      var margin = 0.5 * (to - from);
      var scale = dataSourceScale || [null, null];

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
            return numberFilter(value);
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

    function getScaleStateAndChoices(observedScales, criteria) {
      var scaleState = {};
      var choices = {};
      _.forEach(criteria, function(criterion) {
        _.forEach(criterion.dataSources, function(dataSource) {
          // Calculate interval hulls
          var dataSourceRange = intervalHull(observedScales[dataSource.id]);
          var pvf = dataSource.pvf;
          var problemRange = pvf ? pvf.range : null;
          var from = problemRange ? problemRange[0] : dataSourceRange[0];
          var to = problemRange ? problemRange[1] : dataSourceRange[1];

          // Set inital model value
          choices[dataSource.id] = {
            from: niceFrom(from),
            to: niceTo(to)
          };

          // Set scales for slider
          var dataSourceScale = dataSource.scale;
          scaleState[dataSource.id] = calculateScales(dataSourceScale, from, to, dataSourceRange);
        });
      });
      return {
        scaleState: scaleState,
        choices: choices
      };
    }

    return {
      nice: nice,
      niceTo: niceTo,
      niceFrom: niceFrom,
      calculateScales: calculateScales,
      createRanges: createRanges,
      getScaleStateAndChoices: getScaleStateAndChoices
    };
  };

  return dependencies.concat(ScaleRangeService);
});

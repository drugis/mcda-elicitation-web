'use strict';
define(['lodash', 'angular'], function(_, angular) {
  function intervalHull() {
    return function(scaleRanges, effects) {
      var minHull = [];
      var maxHull = [];
      if (scaleRanges) {
        minHull = getHull(scaleRanges, '2.5%');
        maxHull = getHull(scaleRanges, '97.5%');
      }
      if (effects && effects.length) {
        minHull = minHull.concat(getMinEffect(effects));
        maxHull = maxHull.concat(getMaxEffect(effects));
      }
      return [
        Math.min.apply(null, minHull),
        Math.max.apply(null, maxHull)
      ];
    };
  }

  function getMinEffect(effectValues) {
    return _.reduce(effectValues, function(minimum, effect) {
      return minimum < effect ? minimum : effect;
    }, effectValues[0]);

  }

  function getMaxEffect(effectValues) {
    return _.reduce(effectValues, function(maximum, effect) {
      return maximum > effect ? maximum : effect;
    }, effectValues[0]);
  }


  function getHull(scaleRanges, percentage) {
    return _(scaleRanges)
      .values()
      .map(_.partial(getValues, percentage))
      .filter(isNotNull)
      .value();
  }

  function getValues(percentage, alternative) {
    return alternative[percentage];
  }

  function isNotNull(value) {
    return value !== null;
  }


  return angular.module('elicit.util', [])
    .factory('intervalHull', intervalHull)

    .factory('generateUuid', function() {
      return function() {
        var pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return pattern.replace(/[xy]/g, function(c) {
          /*jslint bitwise: true */
          var r = Math.random() * 16 | 0;
          var v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
    })

    .factory('swap', function() {
      return function(array, fromIdx, toIdx) {
        var mem = array[fromIdx];
        array[fromIdx] = array[toIdx];
        array[toIdx] = mem;
      };
    })

    .factory('significantDigits', function() {
      return function(x, precision) {
        if (precision !== 0 && !precision) {
          precision = 3;
        }
        if (x === 0) {
          return x;
        }
        if (x > 1 || x < -1) {
          return Number.parseFloat(x.toFixed(precision));
        }
        return Number.parseFloat(x.toPrecision(precision));
      };
    })
    ;
});

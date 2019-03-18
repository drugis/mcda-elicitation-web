'use strict';
define(['lodash', 'angular'], function(_, angular) {
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
    .factory('intervalHull', function() {
      return function(scaleRanges) {
        if (!scaleRanges) {
          return [-Infinity, +Infinity];
        }
        return [
          Math.min.apply(null, getHull(scaleRanges, '2.5%')),
          Math.max.apply(null, getHull(scaleRanges, '97.5%'))
        ];
      };
    })

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

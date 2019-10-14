'use strict';
define(['lodash', 'angular'], function(_, angular) {
  function intervalHull() {
    return function(scaleRanges, effects, rangeDistributions) {
      var minHullValues = [];
      var maxHullValues = [];
      if (scaleRanges) {
        minHullValues = getHull(scaleRanges, '2.5%');
        maxHullValues = getHull(scaleRanges, '97.5%');
      }
      if (effects && effects.length) {
        minHullValues = minHullValues.concat(getMinEffect(effects));
        maxHullValues = maxHullValues.concat(getMaxEffect(effects));
      }
      if (rangeDistributions && rangeDistributions.length) {
        minHullValues = minHullValues.concat(getMinEffect(rangeDistributions));
        maxHullValues = maxHullValues.concat(getMaxEffect(rangeDistributions));
      }
      var minHullValue = Math.min.apply(null, minHullValues);
      var maxHullValue = Math.max.apply(null, maxHullValues);

      return [
        minHullValue,
        maxHullValue
      ];
    };
  }

  function getMinEffect(effects) {
    var effectValues = removeUndefinedValues(effects);
    return _.reduce(effectValues, function(minimum, effect) {
      return minimum < effect ? minimum : effect;
    }, effectValues[0]);
  }

  function getMaxEffect(effects) {
    var effectValues = removeUndefinedValues(effects);
    return _.reduce(effectValues, function(maximum, effect) {
      return maximum > effect ? maximum : effect;
    }, effectValues[0]);
  }

  function removeUndefinedValues(effects) {
    return _.reject(effects, function(effect) {
      return effect === undefined ||
        effect === null ||
        isNaN(effect) ||
        typeof (effect) === 'string';
    });
  }

  function getHull(scaleRanges, percentage) {
    return _(scaleRanges)
      .values()
      .map(_.partial(getValues, percentage))
      .filter(isNotNullOrUndefined)
      .value();
  }

  function getValues(percentage, alternative) {
    return alternative[percentage];
  }

  function isNotNullOrUndefined(value) {
    return value !== null && value !== undefined;
  }

  function generateUuid() {
    return function() {
      var pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      return pattern.replace(/[xy]/g, function(c) {
        /*jslint bitwise: true */
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
  }

  function swap() {
    return function(array, fromIdx, toIdx) {
      var mem = array[fromIdx];
      array[fromIdx] = array[toIdx];
      array[toIdx] = mem;
    };
  }

  function significantDigits() {
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
  }

  function getDataSourcesById() {
    return function(criteria) {
      return _(criteria)
        .map(function(criterion) {
          return criterion.dataSources;
        }, [])
        .flatten()
        .keyBy('id')
        .value();
    };
  }

  return angular.module('elicit.util', [])
    .factory('intervalHull', intervalHull)
    .factory('generateUuid', generateUuid)
    .factory('swap', swap)
    .factory('significantDigits', significantDigits)
    .factory('getDataSourcesById', getDataSourcesById)
    ;
});

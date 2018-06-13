'use strict';
define(['lodash', 'angular'], function(_, angular) {
  return angular.module('elicit.util', [])
    .factory('intervalHull', function() {
      return function(scaleRanges) {
        if (!scaleRanges) {
          return [-Infinity, +Infinity];
        }
        return [
          Math.min.apply(null, _.filter(_.map(_.values(scaleRanges), function(alternative) {
            return alternative['2.5%'];
          })), function(value) {
            return value !== null;
          }),
          Math.max.apply(null, _.filter(_.map(_.values(scaleRanges), function(alternative) {
            return alternative['97.5%'];
          })), function(value) {
            return value !== null;
          })
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
    ;
});

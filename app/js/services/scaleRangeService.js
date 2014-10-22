'use strict';
define(['angular'],
  function(angular) {

    var dependencies = [];

    var ScaleRangeService = function() {

      function nice(x) {
        var log10 = function(y) {
          return Math.log(y) / Math.log(10);
        };
        var negative = x < 0;
        var absX = Math.abs(x);
        var val = Math.pow(10, Math.floor(log10(absX)));
        var nice = _.find(_.range(1, 11), function(n) {
          return absX <= val * n;
        });
        return (negative ? -1 : 1) * (val * nice);
      };

      return {
        nice: nice
      };
    };

    return angular.module('elicit.scaleRangeService', dependencies).factory('ScaleRangeService', ScaleRangeService);
  });
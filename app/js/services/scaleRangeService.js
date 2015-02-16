'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  var dependencies = [];

  var ScaleRangeService = function() {

    var log10 = function(x) {
      return Math.log(x) / Math.log(10);
    };

    function nice(x, dirFun) {
      if(x === 0) return 0;
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


    function calculateScales(criterionScale, from, to, criterionRange) {
      var boundFrom = function(val) {
        return val < scale[0] ? scale[0] : val;
      };
      var boundTo = function(val) {
        return val > scale[1] ? scale[1] : val;
      };
      var margin = 0.5 * (to - from);
      var scale = criterionScale || [null, null];

      scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
      scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

      return {
        restrictFrom: criterionRange[0],
        restrictTo: criterionRange[1],
        from: niceFrom(from),
        to: niceTo(to),
        increaseFrom: function() {
          this.from = niceFrom(boundFrom(this.from - margin));
        },
        increaseTo: function() {
          this.to = niceTo(boundTo(this.to + margin));
        }
      };
    }

    return {
      nice: nice,
      niceTo: niceTo,
      niceFrom: niceFrom,
      calculateScales: calculateScales
    };
  };

  return angular.module('elicit.scaleRangeService', dependencies).factory('ScaleRangeService', ScaleRangeService);
});

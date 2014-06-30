'use strict';
define(['underscore', 'angular'], function(_, angular) {
  return angular.module('elicit.util', []).factory('intervalHull', function() {
    return function(scaleRanges) {
      if (!scaleRanges) return [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
      return [
        Math.min.apply(null, _.map(_.values(scaleRanges), function(alt) { return alt["2.5%"] })),
        Math.max.apply(null, _.map(_.values(scaleRanges), function(alt) { return alt["97.5%"] }))
      ];
    };
  });
});

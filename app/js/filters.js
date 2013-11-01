'use strict';
define(['require', 'angular', 'underscore'] , function(require, angular, _) {
  var filters = angular.module('elicit.filters', []);

  filters.filter('precision', function() {
    return function(number, decimals) {
      return number.toFixed(decimals);
    };
  });

  return filters;
});

'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.results', ['patavi'])

    .controller('ResultsController', require('mcda/results/resultsController'))
    .directive('sensitivityInput', require('mcda/results/sensitivityInputDirective'))
    .factory('MCDAResultsService', require('mcda/results/resultsService'))
    ;

  });

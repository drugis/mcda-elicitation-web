'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.results', ['patavi', 'rzModule'])

    .controller('SmaaResultsController', require('mcda/results/smaaResultsController'))
    .controller('DeterministicResultsController', require('mcda/results/deterministicResultsController'))
    .directive('sensitivityInput', require('mcda/results/sensitivityInputDirective'))
    .directive('valueProfilePlot', require('mcda/results/valueProfilePlotDirective'))
    .factory('MCDAResultsService', require('mcda/results/resultsService'))
    ;

  });

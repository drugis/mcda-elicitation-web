'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.results', ['patavi', 'rzModule'])

    .controller('ResultsController', require('mcda/results/resultsController'))
    .directive('sensitivityInput', require('mcda/results/sensitivityInputDirective'))
    .directive('valueProfilePlot', require('mcda/results/valueProfilePlotDirective'))
    .directive('measurementsSensitivityPlot', require('mcda/results/measurementsSensitivityPlotDirective'))
    .factory('MCDAResultsService', require('mcda/results/resultsService'))
    ;

  });

'use strict';
define([
  './deterministicResultsController',

  './lineChartDirective',
  './measurementSensitivityDirective',
  './preferencesSensitivityDirective',
  './sensitivityInputDirective',
  './sensitivityTableDirective',
  './valueProfilePlotDirective',

  './deterministicResultsService',

  'angular',
  'angular-patavi-client'
], function(
  DeterministicResultsController,

  lineChartDirective,
  measurementSensitivityDirective,
  preferencesSensitivityDirective,
  sensitivityInputDirective,
  sensitivityTableDirective,
  valueProfilePlotDirective,

  DeterministicResultsService,

  angular
) {
  return angular.module('elicit.deterministicResults', ['patavi', 'elicit.results'])
    .controller('DeterministicResultsController', DeterministicResultsController)

    .directive('lineChart', lineChartDirective)
    .directive('measurementSensitivity', measurementSensitivityDirective)
    .directive('preferencesSensitivity', preferencesSensitivityDirective)
    .directive('sensitivityInput', sensitivityInputDirective)
    .directive('sensitivityTable', sensitivityTableDirective)
    .directive('valueProfilePlot', valueProfilePlotDirective)

    .factory('DeterministicResultsService', DeterministicResultsService)
    ;
});

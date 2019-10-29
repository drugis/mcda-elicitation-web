'use strict';
define([
  './deterministicResultsController',
  './editLegendController',
  './smaaResultsController',

  './barChartDirective',
  './centralWeightsPlotDirective',
  './heatMapDirective',
  './legendDirective',
  './lineChartDirective',
  './measurementSensitivityDirective',
  './preferencesSensitivityDirective',
  './sensitivityInputDirective',
  './sensitivityTableDirective',
  './smaaTableDirective',
  './rankPlotDirective',
  './valueProfilePlotDirective',

  './deterministicResultsService',
  './resultsService',
  './pataviResultsService',

  'angular',
  'angular-patavi-client'
], function(
  DeterministicResultsController,
  EditLegendController,
  SmaaResultsController,

  barChartDirective,
  centralWeightsPlotDirective,
  heatMapDirective,
  legendDirective,
  lineChartDirective,
  measurementSensitivityDirective,
  preferencesSensitivityDirective,
  sensitivityInputDirective,
  sensitivityTableDirective,
  SmaaTableDirective,
  rankPlotDirective,
  valueProfilePlotDirective,

  DeterministicResultsService,
  MCDAResultsService,
  PataviResultsService,

  angular
) {
  return angular.module('elicit.results', ['patavi'])
    .controller('DeterministicResultsController', DeterministicResultsController)
    .controller('EditLegendController', EditLegendController)
    .controller('SmaaResultsController', SmaaResultsController)

    .directive('barChart', barChartDirective)
    .directive('centralWeightsPlot', centralWeightsPlotDirective)
    .directive('heatMap', heatMapDirective)
    .directive('legend', legendDirective)
    .directive('lineChart', lineChartDirective)
    .directive('measurementSensitivity', measurementSensitivityDirective)
    .directive('preferencesSensitivity', preferencesSensitivityDirective)
    .directive('sensitivityInput', sensitivityInputDirective)
    .directive('sensitivityTable', sensitivityTableDirective)
    .directive('smaaTable', SmaaTableDirective)
    .directive('rankPlot', rankPlotDirective)
    .directive('valueProfilePlot', valueProfilePlotDirective)

    .factory('DeterministicResultsService', DeterministicResultsService)
    .factory('MCDAResultsService', MCDAResultsService)
    .factory('PataviResultsService', PataviResultsService)
    ;
});

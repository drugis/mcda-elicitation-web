'use strict';
define([
  './smaaResultsController',

  './barChartDirective',
  './centralWeightsDirective',
  './centralWeightsPlotDirective',
  './heatMapDirective',
  './smaaTableDirective',
  './rankAcceptabilitiesDirective',
  './rankPlotDirective',
  './smaaWeightsTableDirective',

  './smaaResultsService',

  'angular',
  'angular-patavi-client'
], function(
  SmaaResultsController,

  barChartDirective,
  centralWeightsDirective,
  centralWeightsPlotDirective,
  heatMapDirective,
  SmaaTableDirective,
  rankAcceptabilitiesDirective,
  rankPlotDirective,
  smaaWeightsTableDirective,

  SmaaResultsService,

  angular
) {
  return angular.module('elicit.smaaResults', ['patavi', 'elicit.results'])
    .controller('SmaaResultsController', SmaaResultsController)

    .directive('barChart', barChartDirective)
    .directive('centralWeights', centralWeightsDirective)
    .directive('centralWeightsPlot', centralWeightsPlotDirective)
    .directive('heatMap', heatMapDirective)
    .directive('smaaTable', SmaaTableDirective)
    .directive('rankAcceptabilities', rankAcceptabilitiesDirective)
    .directive('rankPlot', rankPlotDirective)
    .directive('smaaWeightsTable', smaaWeightsTableDirective)

    .factory('SmaaResultsService', SmaaResultsService)
    ;
});

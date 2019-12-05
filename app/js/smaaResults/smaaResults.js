'use strict';
define([
  './smaaResultsController',

  './barChartDirective',
  './centralWeightsPlotDirective',
  './heatMapDirective',
  './smaaTableDirective',
  './rankPlotDirective',
  './smaaWeightsTableDirective',

  './smaaResultsService',

  'angular',
  'angular-patavi-client'
], function(
  SmaaResultsController,

  barChartDirective,
  centralWeightsPlotDirective,
  heatMapDirective,
  SmaaTableDirective,
  rankPlotDirective,
  smaaWeightsTableDirective,

  SmaaResultsService,

  angular
) {
  return angular.module('elicit.smaaResults', ['patavi', 'elicit.results'])
    .controller('SmaaResultsController', SmaaResultsController)

    .directive('barChart', barChartDirective)
    .directive('centralWeightsPlot', centralWeightsPlotDirective)
    .directive('heatMap', heatMapDirective)
    .directive('smaaTable', SmaaTableDirective)
    .directive('rankPlot', rankPlotDirective)
    .directive('smaaWeightsTable', smaaWeightsTableDirective)

    .factory('SmaaResultsService', SmaaResultsService)
    ;
});

'use strict';
define([
  './smaaResultsController',

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

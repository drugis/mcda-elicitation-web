'use strict';
define([
  './smaaResultsController',

  './centralWeightsDirective',
  './centralWeightsPlotDirective',
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
    .directive('smaaTable', SmaaTableDirective)
    .directive('rankAcceptabilities', rankAcceptabilitiesDirective)
    .directive('rankPlot', rankPlotDirective)
    .directive('smaaWeightsTable', smaaWeightsTableDirective)

    .factory('SmaaResultsService', SmaaResultsService)
    ;
});

'use strict';
define([
  './smaaResultsController',
  './deterministicResultsController',
  './editLegendController',
  './sensitivityInputDirective',
  './valueProfilePlotDirective',
  './legendDirective',
  './resultsService',
  './pataviResultsService',
  'angular',
  'angular-patavi-client'
], function(
  SmaaResultsController,
  DeterministicResultsController,
  EditLegendController,
  sensitivityInputDirective,
  valueProfilePlotDirective,
  legendDirective,
  MCDAResultsService,
  PataviResultsService,
  angular
) {
    return angular.module('elicit.results', ['patavi'])
      .controller('SmaaResultsController', SmaaResultsController)
      .controller('DeterministicResultsController', DeterministicResultsController)
      .controller('EditLegendController', EditLegendController)

      .directive('sensitivityInput', sensitivityInputDirective)
      .directive('valueProfilePlot', valueProfilePlotDirective)
      .directive('legend', legendDirective)

      .factory('MCDAResultsService', MCDAResultsService)
      .factory('PataviResultsService', PataviResultsService)
      ;
  });

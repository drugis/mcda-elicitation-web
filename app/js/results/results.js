'use strict';
define([
  './smaaResultsController',
  './deterministicResultsController',
  './editLegendController',
  './sensitivityInputDirective',
  './sensitivityTableDirective',
  './valueProfilePlotDirective',
  './legendDirective',
  './resultsService',
  './deterministicResultsService',
  './pataviResultsService',
  'angular',
  'angular-patavi-client'
], function(
  SmaaResultsController,
  DeterministicResultsController,
  EditLegendController,
  sensitivityInputDirective,
  sensitivityTableDirective,
  valueProfilePlotDirective,
  legendDirective,
  MCDAResultsService,
  DeterministicResultsService,
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
      .directive('sensitivityTable', sensitivityTableDirective)

      .factory('MCDAResultsService', MCDAResultsService)
      .factory('DeterministicResultsService', DeterministicResultsService)
      .factory('PataviResultsService', PataviResultsService)
      ;
  });

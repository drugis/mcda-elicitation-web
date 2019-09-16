'use strict';
define([
  './smaaResultsController',
  './deterministicResultsController',
  './editLegendController',
  './smaaTableDirective',
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
  SmaaTableDirective,
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

      .directive('smaaTable', SmaaTableDirective)
      .directive('sensitivityInput', sensitivityInputDirective)
      .directive('valueProfilePlot', valueProfilePlotDirective)
      .directive('legend', legendDirective)
      .directive('sensitivityTable', sensitivityTableDirective)

      .factory('MCDAResultsService', MCDAResultsService)
      .factory('DeterministicResultsService', DeterministicResultsService)
      .factory('PataviResultsService', PataviResultsService)
      ;
  });

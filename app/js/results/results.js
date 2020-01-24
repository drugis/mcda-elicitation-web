'use strict';
define([
  './editLegendController',

  './heatMapDirective',
  './legendDirective',

  './legendService',
  './pataviResultsService',

  'angular',
  'angular-patavi-client'
], function(
  EditLegendController,

  heatMapDirective,
  legendDirective,

  LegendService,
  PataviResultsService,

  angular
) {
  return angular.module('elicit.results', ['patavi'])
    .controller('EditLegendController', EditLegendController)

    .directive('heatMap', heatMapDirective)
    .directive('legend', legendDirective)

    .factory('LegendService', LegendService)
    .factory('PataviResultsService', PataviResultsService)
    ;
});

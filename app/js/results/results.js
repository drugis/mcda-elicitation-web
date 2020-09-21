'use strict';
define([
  './editLegendController',

  './legendDirective',

  './legendService',
  './pataviResultsService',

  'angular',
  'angular-patavi-client'
], function (
  EditLegendController,

  legendDirective,

  LegendService,
  PataviResultsService,

  angular
) {
  return angular
    .module('elicit.results', ['patavi'])
    .controller('EditLegendController', EditLegendController)

    .directive('legend', legendDirective)

    .factory('LegendService', LegendService)
    .factory('PataviResultsService', PataviResultsService);
});

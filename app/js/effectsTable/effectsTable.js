'use strict';
define([
  'angular',
  './effectsTableScalesCellDirective',
  './effectsTableDirective',
  './criterionListDirective',
  './criterionCardDirective',
  './effectsTableService'], function(
    angular,
    effectsTableScalesCell,
    effectsTable,
    criterionList,
    criterionCard,
    EffectsTableService
  ) {
    return angular.module('elicit.effectsTable', [])
      .directive('effectsTableScalesCell', effectsTableScalesCell)
      .directive('effectsTable', effectsTable)
      .directive('criterionList', criterionList)
      .directive('criterionCard', criterionCard)
      .factory('EffectsTableService', EffectsTableService)
      ;
  });

'use strict';
define([
  'angular',
  './effectsTableCellDirective',
  './effectsTableScalesCellDirective',
  './effectsTableDirective',
  './criterionListDirective',
  './criterionCardDirective',
  './effectsTableService'], function(
    angular,
    effectsTableCell,
    effectsTableScalesCell,
    effectsTable,
    criterionList,
    criterionCard,
    EffectsTableService
  ) {
    return angular.module('elicit.effectsTable', [])
      .directive('effectsTableCell', effectsTableCell)
      .directive('effectsTableScalesCell', effectsTableScalesCell)
      .directive('effectsTable', effectsTable)
      .directive('criterionList', criterionList)
      .directive('criterionCard', criterionCard)
      .factory('EffectsTableService', EffectsTableService)
      ;
  });

'use strict';
define([
  'angular',
  './effectsTableCellDirective',
  './effectsTableScalesCellDirective',
  './criterionListDirective',
  './criterionCardDirective',
  './effectsTableService',
  'react2angular',
  '../../ts/EffectsTable/EffectsTable'
], function (
  angular,
  effectsTableCell,
  effectsTableScalesCell,
  criterionList,
  criterionCard,
  EffectsTableService,
  react2angular,
  EffectsTable
) {
  return angular
    .module('elicit.effectsTable', [])
    .directive('effectsTableCell', effectsTableCell)
    .directive('effectsTableScalesCell', effectsTableScalesCell)
    .directive('criterionList', criterionList)
    .directive('criterionCard', criterionCard)
    .factory('EffectsTableService', EffectsTableService)
    .component(
      'effectsTable',
      react2angular.react2angular(EffectsTable.default, ['oldWorkspace', 'settings', 'scales'])
    );
});

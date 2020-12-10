'use strict';
define([
  'angular',
  './effectsTableCellDirective',
  './effectsTableScalesCellDirective',
  './effectsTableService',
  'react2angular',
  '../../ts/EffectsTable/EffectsTable'
], function (
  angular,
  effectsTableCell,
  effectsTableScalesCell,
  EffectsTableService,
  react2angular,
  EffectsTable
) {
  return angular
    .module('elicit.effectsTable', [])
    .directive('effectsTableCell', effectsTableCell)
    .directive('effectsTableScalesCell', effectsTableScalesCell)
    .factory('EffectsTableService', EffectsTableService)
    .component(
      'effectsTable',
      react2angular.react2angular(EffectsTable.default, [
        'oldWorkspace',
        'settings',
        'scales',
        'toggledColumns'
      ])
    );
});

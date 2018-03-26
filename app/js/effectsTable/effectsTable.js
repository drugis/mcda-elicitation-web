'use strict';
var requires = [
  'mcda/effectsTable/toggleColumnsController',
  'mcda/effectsTable/effectsTableScalesCellDirective',
  'mcda/effectsTable/effectsTableDirective',
  'mcda/effectsTable/toggleColumnsDirective',
  'mcda/effectsTable/effectsTableService'
];
define(['angular'].concat(requires), function(
  angular,
  ToggleColumnsController,
  effectsTableScalesCell,
  effectsTable,
  toggleColumns,
  EffectsTableService
) {
  return angular.module('elicit.effectsTable', [])
    .controller('ToggleColumnsController', ToggleColumnsController)
    .directive('effectsTableScalesCell', effectsTableScalesCell)
    .directive('effectsTable', effectsTable)
    .directive('toggleColumns', toggleColumns)
    .factory('EffectsTableService', EffectsTableService);
});
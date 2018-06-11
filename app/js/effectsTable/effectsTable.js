'use strict';
var requires = [
  'mcda/effectsTable/toggleColumnsController',
  'mcda/effectsTable/effectsTableScalesCellDirective',
  'mcda/effectsTable/effectsTableDirective',
  'mcda/effectsTable/criterionListDirective',
  'mcda/effectsTable/criterionCardDirective',
  'mcda/effectsTable/toggleColumnsDirective',
  'mcda/effectsTable/effectsTableService'
];
define(['angular'].concat(requires), function(
  angular,
  ToggleColumnsController,
  effectsTableScalesCell,
  effectsTable,
  criterionList,
  criterionCard,
  toggleColumns,
  EffectsTableService
) {
  return angular.module('elicit.effectsTable', [])
    .controller('ToggleColumnsController', ToggleColumnsController)
    .directive('effectsTableScalesCell', effectsTableScalesCell)
    .directive('effectsTable', effectsTable)
    .directive('criterionList', criterionList)
    .directive('criterionCard', criterionCard)
    .directive('toggleColumns', toggleColumns)
    .factory('EffectsTableService', EffectsTableService);
});

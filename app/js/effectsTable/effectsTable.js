'use strict';
var requires = [
  'mcda/effectsTable/effectsTableScalesCellDirective',
  'mcda/effectsTable/effectsTableDirective',
  'mcda/effectsTable/criterionListDirective',
  'mcda/effectsTable/criterionCardDirective',
  'mcda/effectsTable/effectsTableService'
];
define(['angular'].concat(requires), function(
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
    .factory('EffectsTableService', EffectsTableService);
});

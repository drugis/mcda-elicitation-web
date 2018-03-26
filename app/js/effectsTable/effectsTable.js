'use strict';
var requires = [
  'mcda/effectsTable/effectsTableScalesCellDirective',
  'mcda/effectsTable/effectsTableDirective',
  'mcda/effectsTable/effectsTableService'
];
define(['angular'].concat(requires), function(
  angular,
  effectsTableScalesCell,
  effectsTable,
  EffectsTableService
) {
  return angular.module('elicit.effectsTable', [])
    .directive('effectsTableScalesCell', effectsTableScalesCell)
    .directive('effectsTable', effectsTable)
    .factory('EffectsTableService', EffectsTableService);
});
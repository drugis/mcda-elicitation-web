'use strict';
define([
  'angular',
  './effectsTableService',
  'react2angular',
  '../../ts/EffectsTable/EffectsTable'
], function (angular, EffectsTableService, react2angular, EffectsTable) {
  return angular
    .module('elicit.effectsTable', [])
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

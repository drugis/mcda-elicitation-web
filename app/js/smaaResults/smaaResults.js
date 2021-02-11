'use strict';
define([
  'angular',
  'react2angular',
  '../../ts/SmaaTab/SmaaTab',

  './smaaResultsController'
], function (
  angular,
  react2angular,
  SmaaTab,

  SmaaResultsController
) {
  return angular
    .module('elicit.smaaResults', [])
    .component(
      'smaaTab',
      react2angular.react2angular(SmaaTab.default, [
        'scenarios',
        'currentScenarioId',
        'workspaceId',
        'updateAngularScenario',
        'workspace',
        'scales',
        'subproblems',
        'currentSubproblem',
        'editMode'
      ])
    )
    .controller('SmaaResultsController', SmaaResultsController);
});

'use strict';
define([
  'angular',
  'react2angular',
  '../../ts/SmaaTab/SmaaTab',

  './smaaResultsController',

  'angular-patavi-client'
], function (
  angular,
  react2angular,
  SmaaTab,

  SmaaResultsController
) {
  return angular
    .module('elicit.smaaResults', ['patavi', 'elicit.results'])
    .component(
      'smaaTab',
      react2angular.react2angular(SmaaTab.default, [
        'scenarios',
        'currentScenarioId',
        'workspaceId',
        'problem',
        'settings',
        'updateAngularScenario',
        'toggledColumns',
        'workspace',
        'scales',
        'subproblems',
        'currentSubproblem',
        'canEdit'
      ])
    )
    .controller('SmaaResultsController', SmaaResultsController);
});

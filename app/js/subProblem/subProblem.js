'use strict';
define([
  './subProblemController',
  '../../ts/Subproblem/SubproblemTab',
  'angular',
  'react2angular'
], function (SubProblemController, SubproblemTab, angular, react2angular) {
  return angular
    .module('elicit.subProblem', [])
    .controller('SubProblemController', SubProblemController)
    .component(
      'subproblemTab',
      react2angular.react2angular(SubproblemTab.default, [
        'workspace',
        'subproblems',
        'currentSubproblem',
        'subproblemChanged',
        'workspaceId'
      ])
    );
});

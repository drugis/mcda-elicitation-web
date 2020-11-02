'use strict';
define([
  './subProblemController',
  '../../ts/Subproblem/Subproblem',
  'angular',
  'react2angular'
], function (SubProblemController, Subproblem, angular, react2angular) {
  return angular
    .module('elicit.subProblem', [])
    .controller('SubProblemController', SubProblemController)
    .component(
      'subproblem',
      react2angular.react2angular(Subproblem.default, [
        'workspace',
        'settings',
        'scales',
        'toggledColumns',
        'subproblems',
        'currentSubproblem',
        'subproblemChanged',
        'workspaceId'
      ])
    );
});

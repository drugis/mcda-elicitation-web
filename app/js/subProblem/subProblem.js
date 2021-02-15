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
        'scales',
        'subproblems',
        'currentSubproblem',
        'subproblemChanged',
        'workspaceId'
      ])
    );
});

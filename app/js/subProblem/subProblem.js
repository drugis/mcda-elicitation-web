'use strict';
define([
  './subProblemController',
  './createSubProblemController',
  './subProblemService',
  './scaleRangeService',
  '../../ts/Subproblem/Subproblem',
  'angular',
  'react2angular'
], function (
  SubProblemController,
  CreateSubProblemController,
  SubProblemService,
  ScaleRangeService,
  Subproblem,
  angular,
  react2angular
) {
  return angular
    .module('elicit.subProblem', [])
    .controller('SubProblemController', SubProblemController)
    .controller('CreateSubProblemController', CreateSubProblemController)
    .factory('SubProblemService', SubProblemService)
    .factory('ScaleRangeService', ScaleRangeService)
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
        'createDialogCallback',
        'workspaceId'
      ])
    );
});

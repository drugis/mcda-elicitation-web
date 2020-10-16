'use strict';
define([
  './subProblemController',
  './createSubProblemController',
  './editSubProblemTitleController',
  './deleteSubproblemController',
  './subProblemService',
  './scaleRangeService',
  '../../ts/Subproblem/Subproblem',
  'angular',
  'react2angular'
], function (
  SubProblemController,
  CreateSubProblemController,
  EditSubProblemTitleController,
  DeleteSubproblemController,
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
    .controller('EditSubProblemTitleController', EditSubProblemTitleController)
    .controller('DeleteSubproblemController', DeleteSubproblemController)
    .factory('SubProblemService', SubProblemService)
    .factory('ScaleRangeService', ScaleRangeService)
    .component(
      'subproblem',
      react2angular.react2angular(Subproblem.default, [
        'workspace',
        'settings',
        'scales',
        'toggledColumns'
      ])
    );
});

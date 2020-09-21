'use strict';
define([
  './subProblemController',
  './createSubProblemController',
  './editSubProblemTitleController',
  './deleteSubproblemController',
  './subProblemService',
  './scaleRangeService',
  'angular'
], function (
  SubProblemController,
  CreateSubProblemController,
  EditSubProblemTitleController,
  DeleteSubproblemController,
  SubProblemService,
  ScaleRangeService,
  angular
) {
  return angular
    .module('elicit.subProblem', [])
    .controller('SubProblemController', SubProblemController)
    .controller('CreateSubProblemController', CreateSubProblemController)
    .controller('EditSubProblemTitleController', EditSubProblemTitleController)
    .controller('DeleteSubproblemController', DeleteSubproblemController)
    .factory('SubProblemService', SubProblemService)
    .factory('ScaleRangeService', ScaleRangeService);
});

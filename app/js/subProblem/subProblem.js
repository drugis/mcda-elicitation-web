'use strict';
define([
  './subProblemController',
  './createSubProblemController',
  './editSubProblemTitleController',
  './subProblemService',
  './scaleRangeService',
  'angular'
], function(
  SubProblemController,
  CreateSubProblemController,
  EditSubProblemTitleController,
  SubProblemService,
  ScaleRangeService,
  angular
) {
    return angular.module('elicit.subProblem', [])
      .controller('SubProblemController', SubProblemController)
      .controller('CreateSubProblemController', CreateSubProblemController)
      .controller('EditSubProblemTitleController', EditSubProblemTitleController)
      .factory('SubProblemService', SubProblemService)
      .factory('ScaleRangeService', ScaleRangeService)
      ;
  });

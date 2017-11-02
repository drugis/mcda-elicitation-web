'use strict';
var requires = [
  'mcda/subProblem/subProblemController',
  'mcda/subProblem/createSubProblemController',
  'mcda/subProblem/subProblemService',
  'mcda/subProblem/scaleRangeService'
];
define(['angular'].concat(requires), function(
  angular,
  SubProblemController,
  CreateSubProblemController,
  SubProblemService,
  ScaleRangeService
) {
  return angular.module('elicit.subProblem', [])
    .controller('SubProblemController', SubProblemController)
    .controller('CreateSubProblemController', CreateSubProblemController)
    .factory('SubProblemService', SubProblemService)
    .factory('ScaleRangeService', ScaleRangeService);
});
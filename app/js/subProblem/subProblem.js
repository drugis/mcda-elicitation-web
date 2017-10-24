'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.subProblem', [])

    .controller('SubProblemController', require('mcda/subProblem/subProblemController'))
    .controller('CreateSubProblemController', require('mcda/subProblem/createSubProblemController'))
    .factory('SubProblemService', require('mcda/subProblem/subProblemService'))
    .factory('ScaleRangeService', require('mcda/subProblem/scaleRangeService'));

  });

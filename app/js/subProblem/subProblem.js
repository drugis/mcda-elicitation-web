'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.subProblem', [])

    .controller('SubProblemController', require('mcda/subProblem/subProblemController'))
    .factory('SubProblemService', require('mcda/subProblem/subProblemService'))
    ;

  });

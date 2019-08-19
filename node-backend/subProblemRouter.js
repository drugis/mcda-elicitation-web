'use strict';
var express = require('express');

module.exports = function(db) {
  var SubProblemService = require('./subProblemService')(db);
  return express.Router()
    .get('/', SubProblemService.querySubProblems)
    .get('/:subProblemId', SubProblemService.getSubProblem)
    .post('/', SubProblemService.createSubProblem)
    .post('/:subProblemId', SubProblemService.updateSubProblem)
    ;
};

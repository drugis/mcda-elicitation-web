'use strict';
var express = require('express');

module.exports = function(db) {
  var SubProblemService = require('./subProblemService')(db);
  return express.Router()
    .get('/', SubProblemService.query)
    .get('/:subProblemId', SubProblemService.get)
    .post('/', SubProblemService.create)
    .post('/:subProblemId', SubProblemService.update)
    ;
};

'use strict';
var _ = require('lodash');
var logger = require('./logger');
var httpStatus = require('http-status-codes');

function reduceProblem(problem) {
  var criteria = _.reduce(problem.criteria, function(accum, criterion, key) {
    accum[key] = _.pick(criterion, ['scale', 'pvf', 'title']);
    return accum;
  }, {});
  return {
    criteria: criteria,
    prefs: problem.prefs
  };
}

function getRanges(problem) {
  var ranges = _.reduce(problem.criteria, function(accum, criterion, key) {
    accum[key] = _.pick(criterion, ['pvf.range']);
    return accum;
  }, {});
  return ranges;
}

function getUser(req) {
  if (req.user) {
    return req.user;
  }
  if (req.session.user) {
    return req.session.user;
  }
}

function handleError(error, next) {
  logger.error(JSON.stringify(error, null, 2));
  next({
    statusCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error.message || error
  });
}

module.exports = {
  reduceProblem: reduceProblem,
  getRanges: getRanges,
  getUser: getUser,
  handleError: handleError
}; 

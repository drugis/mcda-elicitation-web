'use strict';
var _ = require('lodash');
var logger = require('./logger');

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

function checkForError(error, next) {
  if (error) {
    logger.error(JSON.stringify(error, null, 2));
    next({
      statusCode: 500,
      message: error
    });
  }
}

module.exports = {
  reduceProblem: reduceProblem,
  getRanges: getRanges,
  getUser: getUser,
  checkForError: checkForError
}; 

'use strict';
var _ = require('lodash');

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

function getRanges(problem){
  var ranges = _.reduce(problem.criteria, function(accum, criterion, key) {
    accum[key] = _.pick(criterion, ['pvf.range']);
    return accum;
  }, {});
  return ranges;
}

module.exports = {
  reduceProblem: reduceProblem,
  getRanges: getRanges
}; 

import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {logger} from './logger';
import _ from 'lodash';
import IProblem from '../app/ts/interface/Problem/IProblem';

export function getUser(req: any) {
  if (req.user) {
    return req.user;
  }
  if (req.session.user) {
    return req.session.user;
  }
}

export function handleError(error: any, next: any) {
  logger.error(JSON.stringify(error, null, 2));
  next({
    statusCode: error.statusCode || INTERNAL_SERVER_ERROR,
    message: error.message || error
  });
}

export function getRanges(problem: IProblem) {
  return _.reduce(
    problem.criteria,
    function (accum, criterion, key) {
      accum[key] = _.pick(criterion, ['pvf.range']);
      return accum;
    },
    {}
  );
}

export function reduceProblem(problem) {
  var criteria = _.reduce(
    problem.criteria,
    function (accum, criterion, key) {
      accum[key] = _.pick(criterion, ['scale', 'pvf', 'title']);
      return accum;
    },
    {}
  );
  return {
    criteria: criteria,
    prefs: problem.prefs
  };
}

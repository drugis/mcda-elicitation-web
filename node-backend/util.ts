import IProblem from '@shared/interface/Problem/IProblem';
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import _ from 'lodash';
import logger from './loggerTS';
import {Request} from 'express';
import { Error } from '@shared/interface/IError';

export function getUser(request: Request) {
  if (request.user) {
    return request.user;
  }
  if (request.session.user) {
    return request.session.user;
  }
}

export function handleError(error: Error, next: any): void {
  logger.error(JSON.stringify(error, null, 2));
  next({
    statusCode: error.statusCode || INTERNAL_SERVER_ERROR,
    message: error.message
  });
}

export function getRanges(problem: IProblem) {
  return _.reduce(
    problem.criteria,
    function (accum: Record<string, any>, criterion, key) {
      accum[key] = _.pick(criterion, ['pvf.range']);
      return accum;
    },
    {} as IProblem
  );
}

export function reduceProblem(problem: IProblem) {
  var criteria = _.reduce(
    problem.criteria,
    function (accum: Record<string, any>, criterion, key) {
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

import {OurError} from '@shared/interface/IError';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import IScenarioProblem from '@shared/interface/Scenario/IScenarioProblem';
import {Request} from 'express';
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import _ from 'lodash';
import logger from './logger';

export function getUser(request: Request) {
  if (request.user) {
    return request.user;
  } else if (
    request.session &&
    request.session.user &&
    request.session.user.id
  ) {
    return request.session.user;
  } else {
    throw 'No user id found';
  }
}

export function handleError(error: OurError, next: any): void {
  logger.error(JSON.stringify(error, null, 2));
  next({
    statusCode: error.statusCode || INTERNAL_SERVER_ERROR,
    message: error.message
  });
}

export function getRanges(
  problem: IProblem
): Record<string, [number, number] | undefined> {
  return _(problem.criteria)
    .flatMap('dataSources')
    .keyBy('id')
    .mapValues((dataSource: IProblemDataSource) => {
      return dataSource.pvf ? dataSource.pvf.range : undefined;
    })
    .value();
}

export function reduceProblem(problem: IProblem): IScenarioProblem {
  const criteria = _.reduce(
    problem.criteria,
    (accum: Record<string, any>, criterion, key): Record<string, any> => {
      accum[key] = _.pick(criterion, ['scale', 'pvf', 'title']);
      return accum;
    },
    {}
  );
  return {
    criteria: criteria
  };
}

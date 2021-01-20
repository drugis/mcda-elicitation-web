import {OurError} from '@shared/interface/IError';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import IScenarioCriterion from '@shared/interface/Scenario/IScenarioCriterion';
import IScenarioPvf from '@shared/interface/Scenario/IScenarioPvf';
import IUploadProblem from '@shared/interface/UploadProblem/IUploadProblem';
import IUploadProblemCriterion from '@shared/interface/UploadProblem/IUploadProblemCriterion';
import IUploadProblemDataSource from '@shared/interface/UploadProblem/IUploadProblemDataSource';
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import _ from 'lodash';
import logger from './logger';

export function getUser(request: any) {
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
  problem: IUploadProblem
): Record<string, [number, number] | undefined> {
  return _(problem.criteria)
    .flatMap('dataSources')
    .keyBy('id')
    .mapValues((dataSource: IUploadProblemDataSource) => {
      return dataSource.pvf ? dataSource.pvf.range : undefined;
    })
    .value();
}

export function createScenarioProblem(
  criteria: Record<string, IScenarioCriterion>,
  pvfs: Record<string, IScenarioPvf>
): Record<string, IScenarioCriterion> {
  if (hasTooManyDataSources(criteria)) {
    return {};
  } else {
    return createScenarioCriteria(criteria, pvfs);
  }
}

function hasTooManyDataSources(
  criteria: Record<string, IScenarioCriterion>
): boolean {
  return _.some(
    criteria,
    (criterion: IScenarioCriterion): boolean => criterion.dataSources.length > 1
  );
}

function createScenarioCriteria(
  criteria: Record<string, IScenarioCriterion>,
  pvfs: Record<string, IScenarioPvf>
): Record<string, IScenarioCriterion> {
  return _.mapValues(
    criteria,
    (
      scenarioCriterion: IScenarioCriterion,
      criterionId: string
    ): IScenarioCriterion => {
      return scenarioCriterion.dataSources[0].pvf
        ? scenarioCriterion
        : {
            dataSources: [
              {
                pvf: pvfs[criterionId]
              }
            ]
          };
    }
  );
}

export function omitPvfs(uploadProblem: IUploadProblem): IProblem {
  return {
    ...uploadProblem,
    criteria: omitPvfsFromCriteria(uploadProblem.criteria)
  };
}

function omitPvfsFromCriteria(
  uploadCriteria: Record<string, IUploadProblemCriterion>
): Record<string, IProblemCriterion> {
  return _.mapValues(
    uploadCriteria,
    (uploadCriterion: IUploadProblemCriterion): IProblemCriterion => {
      return {
        ...uploadCriterion,
        dataSources: omitPvfsFromDataSources(uploadCriterion.dataSources)
      };
    }
  );
}

function omitPvfsFromDataSources(
  uploadDataSources: IUploadProblemDataSource[]
): IProblemDataSource[] {
  return _.map(
    uploadDataSources,
    (uploadDataSource: IUploadProblemDataSource): IProblemDataSource => {
      return _.omit(uploadDataSource, 'pvf');
    }
  );
}

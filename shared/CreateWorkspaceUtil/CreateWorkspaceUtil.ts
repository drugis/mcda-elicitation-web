import {TPvf} from '@shared/interface/Problem/IPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import IUploadProblemCriterion from '@shared/interface/UploadProblem/IUploadProblemCriterion';
import _ from 'lodash';

export function extractPvfs(
  criteria: Record<string, IUploadProblemCriterion>
): Record<string, TScenarioPvf> {
  return _(criteria).pickBy(isPvfSet).mapValues(omitRange).value();
}

function omitRange(criterion: IUploadProblemCriterion): TScenarioPvf {
  if (isPieceWiseLinearPvf(criterion.dataSources[0].pvf)) {
    return _.omit(criterion.dataSources[0].pvf, 'range');
  } else {
    return _.omit(criterion.dataSources[0].pvf, 'range');
  }
}

function isPvfSet(criterion: IUploadProblemCriterion): Boolean {
  return criterion.dataSources[0].pvf && 'type' in criterion.dataSources[0].pvf;
}

function isPieceWiseLinearPvf(pvf: TPvf): pvf is IPieceWiseLinearPvf {
  return pvf.type === 'piecewise-linear';
}

export function extractRanges(
  criteria: Record<string, IUploadProblemCriterion>
): Record<string, [number, number]> {
  return _(criteria)
    .flatMap('dataSources')
    .filter('pvf')
    .keyBy('id')
    .mapValues((dataSource) => dataSource.pvf.range)
    .value();
}

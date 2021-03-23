import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import IUploadProblemCriterion from '@shared/interface/UploadProblem/IUploadProblemCriterion';
import _ from 'lodash';

export function extractPvfs(
  criteria: Record<string, IUploadProblemCriterion>
): Record<string, TScenarioPvf> {
  return _(criteria)
    .mapValues((criterion) => _.omit(criterion.dataSources[0].pvf, 'range'))
    .pickBy(isUsablePvf)
    .value();
}

function isUsablePvf(pvf: TScenarioPvf): pvf is ILinearPvf {
  //make ts not care about type of PVF FIXME
  return Boolean(pvf.direction);
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

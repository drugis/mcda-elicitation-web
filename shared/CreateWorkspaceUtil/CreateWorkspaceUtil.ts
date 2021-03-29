import {TPvf} from '@shared/interface/Problem/IPvf';
import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import IUploadProblemCriterion from '@shared/interface/UploadProblem/IUploadProblemCriterion';
import {isPieceWiseLinearPvf} from 'app/ts/PreferencesTab/PreferencesUtil';
import _ from 'lodash';

export function extractPvfs(
  criteria: Record<string, IUploadProblemCriterion>
): Record<string, TScenarioPvf> {
  return _(criteria).mapValues(omitRange).pickBy(isPvfSet).value();
}

function omitRange(criterion: IUploadProblemCriterion): TScenarioPvf {
  if (isPieceWiseLinearPvf(criterion.dataSources[0].pvf)) {
    return _.omit(criterion.dataSources[0].pvf, 'range');
  } else {
    return _.omit(criterion.dataSources[0].pvf, 'range');
  }
}

function isPvfSet(pvf: TPvf): Boolean {
  return 'type' in pvf;
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

import ICriterion from '@shared/interface/ICriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import _ from 'lodash';
import {
  getBest,
  getWorst
} from '../../Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {DEFAULT_PRECISE_TEMPLATE} from '../elicitationConstants';

export function getSwingStatement(
  criterion: ICriterion,
  pvf: IPvf,
  showPercentages: boolean
): string {
  const unit = criterion.dataSources[0].unitOfMeasurement;
  const label = getUnitLabel(unit, showPercentages);
  const usePercentage = showPercentages && canBePercentage(unit.type);
  return DEFAULT_PRECISE_TEMPLATE.replace(/%criterion1%/gi, criterion.title)
    .replace(/%unit1%/gi, label)
    .replace(/%worst1%/gi, String(getWorst(pvf, usePercentage)))
    .replace(/%best1%/gi, String(getBest(pvf, usePercentage)));
}

export function buildInitialPrecisePreferences(
  criteria: ICriterion[],
  mostImportantCriterionId: string
): Record<string, IExactSwingRatio> {
  return _(criteria)
    .filter((criterion) => {
      return criterion.id !== mostImportantCriterionId;
    })
    .map((criterion) => {
      const preference: IExactSwingRatio = {
        criteria: [mostImportantCriterionId, criterion.id],
        elicitationMethod: 'precise',
        type: 'exact swing',
        ratio: 1
      };
      return [criterion.id, preference];
    })
    .fromPairs()
    .value();
}

import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import _ from 'lodash';
import {
  getBest,
  getWorst
} from '../../Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {DEFAULT_PRECISE_TEMPLATE} from '../elicitationConstants';
import IExactSwingRatio from '../Interface/IExactSwingRatio';

export function getSwingStatement(
  criterion: IPreferencesCriterion,
  pvf: IPvf
): string {
  return DEFAULT_PRECISE_TEMPLATE.replace(/%criterion1%/gi, criterion.title)
    .replace(/%unit1%/gi, criterion.unitOfMeasurement.label)
    .replace(/%worst1%/gi, String(getWorst(pvf)))
    .replace(/%best1%/gi, String(getBest(pvf)));
}

export function buildInitialPrecisePreferences(
  criteria: Record<string, IPreferencesCriterion>,
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

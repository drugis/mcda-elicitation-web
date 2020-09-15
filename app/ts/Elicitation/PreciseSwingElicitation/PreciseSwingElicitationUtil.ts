import _ from 'lodash';
import {DEFAULT_PRECISE_TEMPLATE} from '../elicitationConstants';
import {getBest, getWorst} from '../ElicitationUtil';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IExactSwingRatio from '../Interface/IExactSwingRatio';

export function getSwingStatement(criterion: IElicitationCriterion): string {
  return DEFAULT_PRECISE_TEMPLATE.replace(/%criterion1%/gi, criterion.title)
    .replace(/%unit1%/gi, criterion.unitOfMeasurement.label)
    .replace(/%worst1%/gi, String(getWorst(criterion)))
    .replace(/%best1%/gi, String(getBest(criterion)));
}

export function setInitialPrecisePreferences(
  criteria: Record<string, IElicitationCriterion>,
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

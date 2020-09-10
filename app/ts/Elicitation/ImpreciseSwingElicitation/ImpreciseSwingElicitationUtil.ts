import _ from 'lodash';
import {DEFAULT_PRECISE_TEMPLATE} from '../elicitationConstants';
import {getBest, getWorst} from '../ElicitationUtil';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IRatioBound from '../Interface/IRatioBound';

export function getImpreciseSwingStatement(
  criterion: IElicitationCriterion
): string {
  return DEFAULT_PRECISE_TEMPLATE.replace(/%criterion1%/gi, criterion.title)
    .replace(/%unit1%/gi, criterion.unitOfMeasurement.label)
    .replace(/%worst1%/gi, String(getWorst(criterion)))
    .replace(/%best1%/gi, String(getBest(criterion)));
}

export function setInitialImprecisePreferences(
  criteria: Record<string, IElicitationCriterion>,
  mostImportantCriterionId: string
): Record<string, IRatioBound> {
  return _(criteria)
    .filter((criterion) => {
      return criterion.id !== mostImportantCriterionId;
    })
    .map((criterion) => {
      const preference: IRatioBound = {
        criteria: [mostImportantCriterionId, criterion.id],
        elicitationMethod: 'imprecise',
        type: 'ratio bound',
        bounds: [1, 100]
      };
      return [criterion.id, preference];
    })
    .fromPairs()
    .value();
}

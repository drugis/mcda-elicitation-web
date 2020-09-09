import {DEFAULT_PRECISE_TEMPLATE} from '../elicitationConstants';
import {getBest, getWorst} from '../ElicitationUtil';
import IElicitationCriterion from '../Interface/IElicitationCriterion';

export function getPreciseSwingStatement(
  criterion: IElicitationCriterion
): string {
  return DEFAULT_PRECISE_TEMPLATE.replace(/%criterion1%/gi, criterion.title)
    .replace(/%unit1%/gi, criterion.unitOfMeasurement.label)
    .replace(/%worst1%/gi, String(getWorst(criterion)))
    .replace(/%best1%/gi, String(getBest(criterion)));
}

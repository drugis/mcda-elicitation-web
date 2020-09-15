import _ from 'lodash';
import {DEFAULT_MATCHING_TEMPLATE} from '../elicitationConstants';
import {getBest, getWorst} from '../ElicitationUtil';
import IElicitationCriterion from '../Interface/IElicitationCriterion';

export function getCurrentCriterion(
  criteria: Record<string, IElicitationCriterion>,
  mostImportantCriterionId: string,
  currentStep: number
) {
  return _.reject(criteria, (criterion: IElicitationCriterion) => {
    return criterion.id === mostImportantCriterionId;
  })[currentStep - 2];
}

export function getMatchingStatement(
  mostImportantCriterion: IElicitationCriterion,
  currentCriterion: IElicitationCriterion
): string {
  return DEFAULT_MATCHING_TEMPLATE.replace(
    /%criterion1%/gi,
    mostImportantCriterion.title
  )
    .replace(/%unit1%/gi, mostImportantCriterion.unitOfMeasurement.label)
    .replace(/%worst1%/gi, String(getWorst(mostImportantCriterion)))
    .replace(/%best1%/gi, String(getBest(mostImportantCriterion)))
    .replace(/%criterion2%/gi, currentCriterion.title)
    .replace(/%unit2%/gi, currentCriterion.unitOfMeasurement.label)
    .replace(/%worst2%/gi, String(getWorst(currentCriterion)))
    .replace(/%best2%/gi, String(getBest(currentCriterion)));
}

export function determineStepSize(
  criteria: Record<string, IElicitationCriterion>,
  currentCriterionId: string
): number {
  const criterion: IElicitationCriterion = criteria[currentCriterionId];
  const interval = _.max(criterion.scales) - _.min(criterion.scales);
  const magnitude = Math.floor(Math.log10(interval));
  return Math.pow(10, magnitude - 1);
}

export function calculateImportance(
  sliderValue: number,
  scales: [number, number]
): number {
  const rebased = sliderValue - Math.min(...scales);
  const importance = (rebased / Math.abs(scales[0] - scales[1])) * 100;
  return importance === 0 ? 100 : importance;
}

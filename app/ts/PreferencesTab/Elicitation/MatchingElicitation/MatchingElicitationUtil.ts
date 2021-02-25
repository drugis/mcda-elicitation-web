import ICriterion from '@shared/interface/ICriterion';
import {TPvf} from '@shared/interface/Problem/IPvf';
import _ from 'lodash';
import {DEFAULT_MATCHING_TEMPLATE} from '../elicitationConstants';

export function getCurrentCriterion(
  criteria: ICriterion[],
  mostImportantCriterionId: string,
  currentStep: number
): ICriterion {
  return _.reject(criteria, (criterion: ICriterion) => {
    return criterion.id === mostImportantCriterionId;
  })[currentStep - 2];
}

export function getMatchingStatement(
  mostImportantCriterion: ICriterion,
  currentCriterion: ICriterion
): string {
  return DEFAULT_MATCHING_TEMPLATE.replace(
    /%criterion1%/gi,
    mostImportantCriterion.title
  ).replace(/%criterion2%/gi, currentCriterion.title);
}

export function determineStepSize([lowerBound, upperBound]: [
  number,
  number
]): number {
  const interval = upperBound - lowerBound;
  const magnitude = Math.floor(Math.log10(interval));
  return Math.pow(10, magnitude - 1);
}

export function calculateImportance(
  sliderValue: number,
  {range: [lowerBound, upperBound], direction}: TPvf
): number {
  const rebased =
    direction === 'decreasing'
      ? upperBound - sliderValue
      : sliderValue - lowerBound;
  const importance = (rebased / Math.abs(lowerBound - upperBound)) * 100;
  return importance;
}

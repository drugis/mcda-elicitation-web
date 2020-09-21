import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import _ from 'lodash';
import {DEFAULT_MATCHING_TEMPLATE} from '../elicitationConstants';

export function getCurrentCriterion(
  criteria: Record<string, IPreferencesCriterion>,
  mostImportantCriterionId: string,
  currentStep: number
) {
  return _.reject(criteria, (criterion: IPreferencesCriterion) => {
    return criterion.id === mostImportantCriterionId;
  })[currentStep - 2];
}

export function getMatchingStatement(
  mostImportantCriterion: IPreferencesCriterion,
  currentCriterion: IPreferencesCriterion
): string {
  return DEFAULT_MATCHING_TEMPLATE.replace(
    /%criterion1%/gi,
    mostImportantCriterion.title
  ).replace(/%criterion2%/gi, currentCriterion.title);
}

export function determineStepSize(range: [number, number]): number {
  const interval = range[1] - range[0];
  const magnitude = Math.floor(Math.log10(interval));
  return Math.pow(10, magnitude - 1);
}

export function calculateImportance(
  sliderValue: number,
  range: [number, number]
): number {
  const rebased = sliderValue - range[0];
  const importance = (rebased / Math.abs(range[0] - range[1])) * 100;
  return importance === 0 ? 100 : importance;
}

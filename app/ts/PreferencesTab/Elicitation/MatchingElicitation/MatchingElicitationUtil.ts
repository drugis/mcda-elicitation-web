import ICriterion from '@shared/interface/ICriterion';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import _ from 'lodash';
import {isPieceWiseLinearPvf} from '../../PreferencesUtil';
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

export function calculateImportance(sliderValue: number, pvf: TPvf): number {
  if (isPieceWiseLinearPvf(pvf)) {
    return calculatePiecewiseImportance(sliderValue, pvf);
  } else {
    return calculateLinearImportance(sliderValue, pvf);
  }
}

function calculateLinearImportance(
  sliderValue: number,
  {range: [lowerBound, upperBound], direction}: ILinearPvf
) {
  const rebased =
    direction === 'decreasing'
      ? upperBound - sliderValue
      : sliderValue - lowerBound;
  return (rebased / Math.abs(lowerBound - upperBound)) * 100;
}

function calculatePiecewiseImportance(
  value: number,
  pvf: IPieceWiseLinearPvf
): number {
  const {
    cutoffs,
    range: [lowerBound, upperBound],
    direction
  } = pvf;
  const cutoffsWithBounds = [lowerBound, ...cutoffs, upperBound];
  const valuesWithBounds =
    direction === 'increasing'
      ? [0, 0.25, 0.5, 0.75, 1]
      : [1, 0.75, 0.5, 0.25, 0];
  const exactCutoffIdx = _.findIndex(
    cutoffsWithBounds,
    (x: number): boolean => x === value
  );
  if (exactCutoffIdx !== -1) {
    return valuesWithBounds[exactCutoffIdx] * 100;
  } else {
    return (
      calculateIntermediateValue(
        value,
        cutoffsWithBounds,
        valuesWithBounds,
        direction
      ) * 100
    );
  }
}

function calculateIntermediateValue(
  value: number,
  cutoffsWithBounds: number[],
  valuesWithBounds: number[],
  direction: TPvfDirection
): number {
  const largerCutoffIdx = _.findIndex(
    cutoffsWithBounds,
    (x: number): boolean => x > value
  );
  const [lowerCutOff, upperCutOff] = [
    cutoffsWithBounds[largerCutoffIdx - 1],
    cutoffsWithBounds[largerCutoffIdx]
  ];

  const rebased = value - lowerCutOff;
  const ratioOfQuartile = rebased / (upperCutOff - lowerCutOff);
  const quartileValue = valuesWithBounds[largerCutoffIdx - 1];
  if (direction === 'increasing') {
    return quartileValue + 0.25 * ratioOfQuartile;
  } else {
    return quartileValue - 0.25 * ratioOfQuartile;
  }
}

import {TPvf} from '@shared/interface/Problem/IPvf';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {getBest} from '../PartialValueFunctions/PartialValueFunctionUtil';

export function getPartOfInterval(
  from: number,
  to: number,
  lowerBound: number,
  upperbound: number
): number {
  return Math.abs(to - from) / (upperbound - lowerBound);
}

export function getInitialReferenceValueBy(
  lowerBound: number,
  upperBound: number
): number {
  return upperBound - lowerBound;
}

export function getInitialReferenceValueFrom(
  lowerBound: number,
  upperBound: number,
  pvf: TPvf
): number {
  const multiplier = pvf.direction === 'increasing' ? 0.45 : 0.55;
  return (upperBound - lowerBound) * multiplier + lowerBound;
}

export function getInitialReferenceValueTo(
  lowerBound: number,
  upperBound: number,
  pvf: TPvf
): number {
  const multiplier = pvf.direction === 'increasing' ? 0.55 : 0.45;
  return (upperBound - lowerBound) * multiplier + lowerBound;
}

export function getImprovedValue(
  usePercentage: boolean,
  criterionWeight: number,
  pvf: TPvf,
  partOfInterval: number,
  referenceWeight: number
): number {
  const interval = pvf.range[1] - pvf.range[0];
  const change =
    (referenceWeight / criterionWeight) * partOfInterval * interval;
  if (pvf.direction === 'increasing') {
    return getPercentifiedValue(pvf.range[0] + change, usePercentage);
  } else {
    return getPercentifiedValue(pvf.range[1] - change, usePercentage);
  }
}

export function isImprovedValueRealistic(
  value: number,
  usePercentage: boolean,
  pvf: TPvf
): boolean {
  const best = getBest(pvf, usePercentage);
  if (pvf.direction === 'increasing') {
    return value <= best;
  } else {
    return value >= best;
  }
}

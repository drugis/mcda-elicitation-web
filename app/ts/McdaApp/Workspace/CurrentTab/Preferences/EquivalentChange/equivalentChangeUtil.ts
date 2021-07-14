import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';

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
  return (upperBound - lowerBound) / 2;
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

export function getEquivalentRangeValue(
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

export function getEquivalentValue(
  usePercentage: boolean,
  criterionWeight: number,
  pvf: TPvf,
  partOfInterval: number,
  referenceWeight: number
) {
  const interval = pvf.range[1] - pvf.range[0];
  const change =
    (referenceWeight / criterionWeight) * partOfInterval * interval;
  return Math.abs(getPercentifiedValue(change, usePercentage));
}

export function increaseSliderRange(
  currentUpperValue: number,
  stepSize: number,
  unit: IUnitOfMeasurement
): number {
  const theoreticalUpper = unit.type === 'custom' ? unit.upperBound : 1;
  const limit = _.isNull(theoreticalUpper) ? Infinity : theoreticalUpper;
  const newTo = significantDigits(currentUpperValue + stepSize * 10);
  return Math.min(newTo, limit);
}

export function isSliderExtenderDisabled(
  currentUpperValue: number,
  unit: IUnitOfMeasurement
): boolean {
  const theoreticalUpper = unit.type === 'custom' ? unit.upperBound : 1;
  return currentUpperValue === theoreticalUpper;
}

import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {
  getPercentifiedValue,
  getPercentifiedValueLabel
} from 'app/ts/DisplayUtil/DisplayUtil';
import {TEquivalentChange} from 'app/ts/type/EquivalentChange';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import {getWorst} from '../PartialValueFunctions/PartialValueFunctionUtil';

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
  const multiplier = pvf.direction === 'increasing' ? 0.25 : 0.75;
  return (upperBound - lowerBound) * multiplier + lowerBound;
}

export function getInitialReferenceValueTo(
  lowerBound: number,
  upperBound: number,
  pvf: TPvf
): number {
  const multiplier = pvf.direction === 'increasing' ? 0.75 : 0.25;
  return (upperBound - lowerBound) * multiplier + lowerBound;
}

export function getEquivalentRangeValue(
  criterionWeight: number,
  pvf: TPvf,
  partOfInterval: number,
  referenceWeight: number
): number {
  const change = getEquivalentChange(
    criterionWeight,
    pvf,
    partOfInterval,
    referenceWeight
  );
  if (pvf.direction === 'increasing') {
    return pvf.range[0] + change;
  } else {
    return pvf.range[1] - change;
  }
}

export function getEquivalentChange(
  criterionWeight: number,
  pvf: TPvf,
  partOfInterval: number,
  referenceWeight: number
): number {
  const interval = pvf.range[1] - pvf.range[0];
  return (referenceWeight / criterionWeight) * partOfInterval * interval;
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

export function getEquivalentChangeLabel(
  equivalentChangeType: TEquivalentChange,
  equivalentChange: number,
  pvf: TPvf,
  usePercentage: boolean
): string {
  switch (equivalentChangeType) {
    case 'amount':
      return getPercentifiedValueLabel(equivalentChange, usePercentage);
    case 'range':
      return getEquivalentChangeRangeLabel(
        equivalentChange,
        usePercentage,
        pvf
      );
  }
}

function getEquivalentChangeRangeLabel(
  equivalentValue: number,
  usePercentage: boolean,
  pvf: TPvf
): string {
  const worst = getWorst(pvf, usePercentage);
  const value =
    pvf.direction === 'increasing'
      ? worst + getPercentifiedValue(equivalentValue, usePercentage)
      : worst - getPercentifiedValue(equivalentValue, usePercentage);
  return `${worst} to ${significantDigits(value)}`;
}

import ICriterion from '@shared/interface/ICriterion';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {TPvf} from '@shared/interface/Problem/IPvf';
import IEquivalentChange from '@shared/interface/Scenario/IEquivalentChange';
import {
  getPercentifiedValue,
  getPercentifiedValueLabel
} from 'app/ts/DisplayUtil/DisplayUtil';
import {TEquivalentChange} from 'app/ts/type/equivalentChange';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import {hasNoRange} from '../../../CurrentSubproblemContext/SubproblemUtil';
import {getWorst} from '../PartialValueFunctions/PartialValueFunctionUtil';

export function getPartOfInterval(
  {
    by,
    from,
    to,
    type
  }:
    | IEquivalentChange
    | Omit<IEquivalentChange, 'partOfInterval' | 'referenceCriterionId'>,
  [lowerBound, upperBound]: [number, number]
): number {
  return type === 'amount'
    ? Math.abs(by) / (upperBound - lowerBound)
    : Math.abs(to - from) / (upperBound - lowerBound);
}

export function getReferenceValueBy(
  lowerBound: number,
  upperBound: number
): number {
  return (upperBound - lowerBound) / 2;
}

export function getReferenceValueFrom(
  lowerBound: number,
  upperBound: number,
  pvf: TPvf
): number {
  const multiplier = pvf.direction === 'increasing' ? 0.25 : 0.75;
  return (upperBound - lowerBound) * multiplier + lowerBound;
}

export function getReferenceValueTo(
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
  const change = getEquivalentChangeValue(
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

export function getEquivalentChangeValue(
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

export function getTheoreticalRange(
  unit: IUnitOfMeasurement,
  usePercentage: boolean
): [number, number] {
  const lowerBound = _.isNull(unit.lowerBound) ? -Infinity : unit.lowerBound;
  const upperBound = getUpperBound(unit, usePercentage);
  return [lowerBound, upperBound];
}

function getUpperBound(unit: IUnitOfMeasurement, usePercentage: boolean) {
  if (_.isNull(unit.upperBound)) {
    return Infinity;
  } else if (usePercentage && unit.type === 'decimal') {
    return 100;
  } else if (!usePercentage && unit.type === 'percentage') {
    return 1;
  } else {
    return unit.upperBound;
  }
}

export function getEquivalentChange(
  newReferenceCriterion: ICriterion,
  [lowerBound, upperBound]: [number, number],
  pvf: TPvf
): IEquivalentChange {
  const by = getReferenceValueBy(lowerBound, upperBound);
  const from = getReferenceValueFrom(lowerBound, upperBound, pvf);
  const to = getReferenceValueTo(lowerBound, upperBound, pvf);
  const type = 'amount';
  return {
    by,
    from,
    to,
    referenceCriterionId: newReferenceCriterion.id,
    partOfInterval: getPartOfInterval({by, from, to, type}, [
      lowerBound,
      upperBound
    ]),
    type
  };
}

export function getBounds(
  dataSourceId: string,
  configuredRanges: Record<string, [number, number]>,
  observedRanges: Record<string, [number, number]>
): [number, number] {
  if (hasNoRange(configuredRanges, dataSourceId)) {
    return observedRanges[dataSourceId];
  } else {
    return configuredRanges[dataSourceId];
  }
}

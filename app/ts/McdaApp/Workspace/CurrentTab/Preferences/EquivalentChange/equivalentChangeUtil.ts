import ICriterion from '@shared/interface/ICriterion';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {TPvf} from '@shared/interface/Problem/IPvf';
import IEquivalentChange from '@shared/interface/Scenario/IEquivalentChange';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import {hasNoRange} from '../../../CurrentSubproblemContext/SubproblemUtil';

export function getPartOfInterval(
  by: number,
  [lowerBound, upperBound]: [number, number]
): number {
  return Math.abs(by) / (upperBound - lowerBound);
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
  [lowerBound, upperBound]: [number, number]
): IEquivalentChange {
  const by = getReferenceValueBy(lowerBound, upperBound);
  return {
    by,
    referenceCriterionId: newReferenceCriterion.id,
    partOfInterval: getPartOfInterval(by, [lowerBound, upperBound])
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

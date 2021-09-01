import ICriterion from '@shared/interface/ICriterion';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {TPvf} from '@shared/interface/Problem/IPvf';
import IEquivalentChange from '@shared/interface/Scenario/IEquivalentChange';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
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

export function getEquivalentChangeValue(
  criterionWeight: number,
  pvf: TPvf,
  partOfInterval: number,
  referenceWeight: number
): number {
  const interval = pvf.range[1] - pvf.range[0];
  return (referenceWeight / criterionWeight) * partOfInterval * interval;
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

export function getEquivalentChangeByThreshold(
  scenario: IMcdaScenario,
  bounds: [number, number]
): IEquivalentChange {
  const referenceCriterionId = scenario.state.prefs[0].criteria[0];
  const by = scenario.state.thresholdValuesByCriterion[referenceCriterionId];
  return {
    by,
    referenceCriterionId: referenceCriterionId,
    partOfInterval: getPartOfInterval(by, bounds)
  };
}

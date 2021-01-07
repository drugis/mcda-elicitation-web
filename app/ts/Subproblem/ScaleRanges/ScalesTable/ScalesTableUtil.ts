import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import IEffect, {Effect} from '@shared/interface/IEffect';
import {IEffectWithValue} from '@shared/interface/IEffectWithValue';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IScale from '@shared/interface/IScale';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import IWorkspace from '@shared/interface/IWorkspace';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import _ from 'lodash';

export function calculateObservedRanges(
  scales: Record<string, Record<string, IScale>>,
  workspace: IWorkspace
): Record<string, [number, number]> {
  return _(workspace.criteria)
    .flatMap('dataSources')
    .keyBy('id')
    .mapValues(_.partial(calculateObservedRange, scales, workspace))
    .value();
}

function calculateObservedRange(
  scales: Record<string, Record<string, IScale>>,
  workspace: IWorkspace,
  dataSource: IDataSource
): [number, number] {
  const dataSourceId = dataSource.id;
  const effectValues = getValuesAndBounds(workspace.effects, dataSource);
  const rangeDistributionValues = getValuesAndBounds(
    workspace.distributions,
    dataSource
  );
  const scaleRangesValues = getScaleRangeValues(scales[dataSourceId]);

  const allValues = [
    ...effectValues,
    ...scaleRangesValues,
    ...rangeDistributionValues
  ];

  return [
    significantDigits(_.min(allValues)),
    significantDigits(_.max(allValues))
  ];
}

function getValuesAndBounds(
  effects: (Effect | Distribution)[],
  dataSource: IDataSource
): number[] {
  return _(effects)
    .filter(['dataSourceId', dataSource.id])
    .flatMap((entry: Effect | Distribution): number[] => {
      if (hasValue(entry)) {
        return [entry.value];
      } else if (hasRange(entry)) {
        return [entry.lowerBound, entry.upperBound];
      } else {
        return [];
      }
    })
    .value();
}

function hasValue(effect: IEffect): effect is IEffectWithValue {
  return (effect as IEffectWithValue).value !== undefined;
}

function hasRange(effect: IEffect): effect is IRangeEffect {
  return (effect as IRangeEffect).type === 'range';
}

function getScaleRangeValues(scaleRanges: Record<string, IScale>): number[] {
  return _(scaleRanges)
    .values()
    .flatMap((scale) => {
      return [scale['2.5%'], scale['97.5%']];
    })
    .filter(filterUndefined)
    .value();
}

function filterUndefined(value: number) {
  return value !== undefined && value !== null && !isNaN(value);
}

export function getConfiguredRangeLabel(
  usePercentage: boolean,
  observedRange: [number, number],
  configuredRange?: [number, number]
): string {
  return getRangeLabel(
    usePercentage,
    configuredRange ? configuredRange : observedRange
  );
}

export function getRangeLabel(
  usePercentage: boolean,
  [lowerRange, upperRange]: [number, number]
): string {
  const lowerValue = getPercentifiedValue(lowerRange, usePercentage);
  const upperValue = getPercentifiedValue(upperRange, usePercentage);
  return `${lowerValue}, ${upperValue}`;
}

export function getTheoreticalRangeLabel(
  usePercentage: boolean,
  unit: IUnitOfMeasurement
): string {
  const lowerLabel = unit.lowerBound === null ? '-∞' : unit.lowerBound;
  const upperLabel = getUpperBoundLabel(usePercentage, unit);
  return `${lowerLabel}, ${upperLabel}`;
}

export function getUpperBound(
  usePercentage: boolean,
  unit: IUnitOfMeasurement
): number {
  if (usePercentage && unit.type === 'decimal') {
    return 100;
  } else if (!usePercentage && unit.type === 'percentage') {
    return 1;
  } else {
    return unit.upperBound;
  }
}

export function getUpperBoundLabel(
  usePercentage: boolean,
  unit: IUnitOfMeasurement
): string {
  if (unit.upperBound === null) {
    return '∞';
  } else return getUpperBound(usePercentage, unit).toString();
}

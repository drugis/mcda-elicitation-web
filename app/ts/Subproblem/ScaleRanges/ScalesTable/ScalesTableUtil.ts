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
  const effectValues = getValuesAndBounds(workspace.effects, dataSourceId);
  const rangeDistributionValues = getValuesAndBounds(
    workspace.distributions,
    dataSourceId
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
  dataSourceId: string
): number[] {
  return _(effects)
    .filter(['dataSourceId', dataSourceId])
    .map((entry: Effect | Distribution) => {
      if (hasValue(entry)) {
        return [entry.value];
      } else if (hasRange(entry)) {
        return [entry.lowerBound, entry.upperBound];
      }
    })
    .flatten()
    .filter(filterUndefined)
    .value();
}

function hasValue(effect: IEffect): effect is IEffectWithValue {
  return (effect as IEffectWithValue).value !== undefined;
}

function hasRange(effect: IEffect): effect is IRangeEffect {
  return (effect as IRangeEffect).type === 'range';
}

function filterUndefined(value: number) {
  return value !== undefined && value !== null && !isNaN(value);
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

export function getConfiguredRangeLabel(
  usePercentage: boolean,
  [lowerObservedRange, upperObservedRange]: [number, number],
  configuredRange?: [number, number]
): string {
  if (configuredRange) {
    const [lowerConfiguredRange, upperConfiguredRange] = configuredRange;
    const lowerValue = getPercentifiedValue(
      lowerConfiguredRange,
      usePercentage
    );
    const upperValue = getPercentifiedValue(
      upperConfiguredRange,
      usePercentage
    );
    return `${lowerValue}, ${upperValue}`;
  } else {
    const lowerValue = getPercentifiedValue(lowerObservedRange, usePercentage);
    const upperValue = getPercentifiedValue(upperObservedRange, usePercentage);
    return `${lowerValue}, ${upperValue}`;
  }
}

export function getTheoreticalRangeLabel(
  usePercentage: boolean,
  unit: IUnitOfMeasurement
): string {
  const lowerLabel = unit.lowerBound === null ? '-∞' : unit.lowerBound;
  const upperLabel =
    unit.upperBound === null
      ? '∞'
      : getPercentifiedValue(unit.upperBound, usePercentage);
  return `${lowerLabel}, ${upperLabel}`;
}

import IAlternative from '@shared/interface/IAlternative';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import IEffect, {Effect} from '@shared/interface/IEffect';
import {IEffectWithValue} from '@shared/interface/IEffectWithValue';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IScale from '@shared/interface/IScale';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import IWorkspace from '@shared/interface/IWorkspace';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/util/significantDigits';
import {hasScale} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContextUtil';
import _ from 'lodash';

export function calculateObservedRanges(
  scales: Record<string, Record<string, IScale>>,
  workspace: IWorkspace
): Record<string, [number, number]> {
  const filteredScales = filterScales(scales, workspace.alternatives);
  return _(workspace.criteria)
    .flatMap('dataSources')
    .filter((dataSource: IDataSource) => {
      return hasScale(scales[dataSource.id]);
    })
    .keyBy('id')
    .mapValues(_.partial(calculateObservedRange, filteredScales, workspace))
    .value();
}

function filterScales(
  scales: Record<string, Record<string, IScale>>,
  alternatives: IAlternative[]
): Record<string, Record<string, IScale>> {
  return _.mapValues(
    scales,
    (scaleRanges: Record<string, IScale>): Record<string, IScale> =>
      _.pickBy(scaleRanges, (range: any, alternativeId: string) =>
        _.some(alternatives, ['id', alternativeId])
      )
  );
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

export function getUpperBound(unit: IUnitOfMeasurement): number {
  if (unit.type === 'custom') {
    return unit.upperBound;
  } else {
    return 1;
  }
}

function getUpperBoundLabel(
  usePercentage: boolean,
  unit: IUnitOfMeasurement
): string {
  if (unit.upperBound === null) {
    return '∞';
  } else {
    return usePercentage ? '100' : '1';
  }
}

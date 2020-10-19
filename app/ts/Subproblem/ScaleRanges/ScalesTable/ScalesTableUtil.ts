import IScale from '@shared/interface/IScale';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import _ from 'lodash';

const {decimal, percentage} = UnitOfMeasurementType;

export function calculateObservedRanges(
  scales: Record<string, Record<string, IScale>>,
  criteria: Record<string, IProblemCriterion>,
  performanceTable: IPerformanceTableEntry[]
): Record<string, [number, number]> {
  return _.mapValues(criteria, (criterion): [number, number] => {
    const dataSourceId = criterion.dataSources[0].id;
    const effectValues = getEffectValues(performanceTable, dataSourceId);
    const scaleRangesValues = getScaleRangeValues(scales[dataSourceId]);
    const rangeDistributionValues = getRangeDistributionValues(
      performanceTable,
      dataSourceId
    );

    const allValues = [
      ...effectValues,
      ...scaleRangesValues,
      ...rangeDistributionValues
    ];

    const minHullValue = Math.min.apply(null, allValues);
    const maxHullValue = Math.max.apply(null, allValues);
    return [significantDigits(minHullValue), significantDigits(maxHullValue)];
  });
}

function getEffectValues(
  performanceTable: IPerformanceTableEntry[],
  dataSourceId: string
): number[] {
  return _(performanceTable)
    .map((entry: any) => {
      if (
        entry.dataSource === dataSourceId &&
        entry.performance.effect &&
        entry.performance.effect.type === 'exact'
      ) {
        return entry.performance.effect.value;
      }
    })
    .filter(filterUndefined)
    .value();
}

function getRangeDistributionValues(
  performanceTable: any[],
  dataSourceId: string
): number[] {
  return _(performanceTable)
    .flatMap((entry): [number, number] => {
      if (hasRangeDistribution(entry, dataSourceId)) {
        return [
          entry.performance.distribution.parameters.lowerBound,
          entry.performance.distribution.parameters.upperBound
        ];
      }
    })
    .filter(filterUndefined)
    .value();
}

function filterUndefined(value: number) {
  return value !== undefined && value !== null && !isNaN(value);
}

function hasRangeDistribution(entry: any, dataSourceId: string): boolean {
  return (
    entry.dataSource === dataSourceId &&
    entry.performance.distribution &&
    entry.performance.distribution.type === 'range'
  );
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

export function getConfiguredRange(
  criterion: IProblemCriterion,
  observedRanges: Record<string, [number, number]>,
  showPercentages: boolean
) {
  const pvf = criterion.dataSources[0].pvf;
  const unit = criterion.dataSources[0].unitOfMeasurement.type;
  if (pvf) {
    const lowerValue = getPercentifiedValue(
      pvf.range[0],
      showPercentages,
      unit
    );
    const upperValue = getPercentifiedValue(
      pvf.range[1],
      showPercentages,
      unit
    );
    return `${lowerValue}, ${upperValue}`;
  } else {
    const lowerValue = getPercentifiedValue(
      observedRanges[criterion.id][0],
      showPercentages,
      unit
    );
    const upperValue = getPercentifiedValue(
      observedRanges[criterion.id][1],
      showPercentages,
      unit
    );
    return `${lowerValue}, ${upperValue}`;
  }
}

export function getPercentifiedValue(
  value: number,
  showPercentages: boolean,
  unit: UnitOfMeasurementType
): string {
  if (showPercentages && (unit === decimal || unit === percentage)) {
    return significantDigits(value * 100).toString();
  } else {
    return value.toString();
  }
}
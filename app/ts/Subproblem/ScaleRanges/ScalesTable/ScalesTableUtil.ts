import IScale from '@shared/interface/IScale';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import _ from 'lodash';

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

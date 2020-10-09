import IScale from '@shared/interface/IScale';
import {Performance} from '@shared/interface/Problem/IPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import _ from 'lodash';

export function calculateObservedRanges(
  scales: Record<string, Record<string, IScale>>,
  performanceTable: IPerformanceTableEntry[]
): Record<string, [number, number]> {
  const effectsGroupedByDatasource = _.groupBy(performanceTable, 'dataSource');
  const valuesForDataSource = _.mapValues(
    scales,
    (scaleRow: Record<string, IScale>, dataSourceId: string) => {
      const lowestScaleValues: number[] = _(scaleRow)
        .map('2.5%')
        .filter()
        .value();
      const highestScaleValues: number[] = _(scaleRow)
        .map('97.5%')
        .filter()
        .value();

      const performances: Performance[] = _.map(
        effectsGroupedByDatasource[dataSourceId],
        'performance'
      );
      const effectValues: number[] = _(performances)
        .filter('effect')
        .map((performance) => {
          if (performance.effect && performance.effect.type === 'exact') {
            return performance.effect.value;
          }
        })
        .value();
      const performanceValues = _.map(
        performances,
        (performance: Performance) => {
          let values = [];
          if (performance.effect && performance.effect.type === 'exact') {
            values.push(performance.effect.value);
          }
          if (
            performance.distribution &&
            performance.distribution.type === 'range'
          ) {
            values.push(performance.distribution.parameters.lowerBound);
            values.push(performance.distribution.parameters.upperBound);
          }
          return values;
        }
      );
      return [];
    }
  );
}

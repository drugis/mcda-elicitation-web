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
  const criterionIdRecord = _.keyBy(criteria, (criterion) => {
    return criterion.dataSources[0].id;
  });
  return _.mapValues(criterionIdRecord, (row, dataSourceId): [
    number,
    number
  ] => {
    const effects = getEffectValues(performanceTable, dataSourceId);
    const scaleRanges = scales[dataSourceId];
    const rangeDistributions = getRangeDistributionValues(
      performanceTable,
      dataSourceId
    );

    var minHullValues: number[] = [];
    var maxHullValues: number[] = [];

    minHullValues = getHull(scaleRanges, '2.5%');
    maxHullValues = getHull(scaleRanges, '97.5%');

    if (effects && effects.length) {
      minHullValues = minHullValues.concat(getMinEffect(effects));
      maxHullValues = maxHullValues.concat(getMaxEffect(effects));
    }
    if (rangeDistributions && rangeDistributions.length) {
      minHullValues = minHullValues.concat(getMinEffect(rangeDistributions));
      maxHullValues = maxHullValues.concat(getMaxEffect(rangeDistributions));
    }
    var minHullValue = Math.min.apply(null, minHullValues);
    var maxHullValue = Math.max.apply(null, maxHullValues);

    return [significantDigits(minHullValue), significantDigits(maxHullValue)];
  });
}

function getEffectValues(
  performanceTable: IPerformanceTableEntry[],
  dataSourceId: string
) {
  return _.reduce(
    performanceTable,
    function (accum, entry: any) {
      if (
        entry.dataSource === dataSourceId &&
        entry.performance.effect &&
        entry.performance.effect.type !== 'empty'
      ) {
        accum.push(entry.performance.effect.value);
      }
      return accum;
    },
    []
  );
}

function getRangeDistributionValues(
  performanceTable: any[],
  dataSourceId: string
) {
  return _.reduce(
    performanceTable,
    function (accum, entry) {
      if (hasRangeDistribution(entry, dataSourceId)) {
        accum.push(entry.performance.distribution.parameters.lowerBound);
        accum.push(entry.performance.distribution.parameters.upperBound);
      }
      return accum;
    },
    []
  );
}

function hasRangeDistribution(entry: any, dataSourceId: string) {
  return (
    entry.dataSource === dataSourceId &&
    entry.performance.distribution &&
    entry.performance.distribution.type === 'range'
  );
}

function getMinEffect(effects: number[]) {
  var effectValues = removeUndefinedValues(effects);
  return _.reduce(
    effectValues,
    function (minimum, effect) {
      return minimum < effect ? minimum : effect;
    },
    effectValues[0]
  );
}

function getMaxEffect(effects: number[]) {
  var effectValues = removeUndefinedValues(effects);
  return _.reduce(
    effectValues,
    function (maximum, effect) {
      return maximum > effect ? maximum : effect;
    },
    effectValues[0]
  );
}

function removeUndefinedValues(effects: number[]) {
  return _.reject(effects, function (effect) {
    return (
      effect === undefined ||
      effect === null ||
      isNaN(effect) ||
      typeof effect === 'string'
    );
  });
}

function getHull(scaleRanges: Record<string, IScale>, percentage: string) {
  return _(scaleRanges)
    .values()
    .map(_.partial(getValues, percentage))
    .filter(isNotNullOrUndefined)
    .value();
}

function getValues(percentage: '2.5%' | '97.5%', alternative: IScale) {
  return alternative[percentage];
}

function isNotNullOrUndefined(value: number) {
  return value !== null && value !== undefined;
}

// const valuesForDataSource = _.mapValues(
//   scales,
//   (scaleRow: Record<string, IScale>, dataSourceId: string) => {
//     const lowestScaleValues: number[] = _(scaleRow)
//       .map('2.5%')
//       .filter()
//       .value();
//     const highestScaleValues: number[] = _(scaleRow)
//       .map('97.5%')
//       .filter()
//       .value();

//     const performances: Performance[] = _.map(
//       effectsGroupedByDatasource[dataSourceId],
//       'performance'
//     );
//     const effectValues: number[] = _(performances)
//       .filter('effect')
//       .map((performance: any) => {
//         if (performance.effect && performance.effect.type === 'exact') {
//           return performance.effect.value;
//         }
//       })
//       .value();
//     const performanceValues = _.map(performances, (performance: any) => {
//       let values = [];
//       if (performance.effect && performance.effect.type === 'exact') {
//         values.push(performance.effect.value);
//       }
//       if (
//         performance.distribution &&
//         performance.distribution.type === 'range'
//       ) {
//         values.push(performance.distribution.parameters.lowerBound);
//         values.push(performance.distribution.parameters.upperBound);
//       }
//       return values;
//     });
//     return [];
//   }
// );
// return valuesForDataSource;

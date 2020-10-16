import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import _ from 'lodash';

export function areTooManyDataSourcesIncluded(
  criteria: Record<string, IProblemCriterion>
): boolean {
  return _.some(criteria, function (criterion: IProblemCriterion) {
    return criterion.dataSources.length > 1;
  });
}

export function findRowWithoutValues(
  criteria: Record<string, IProblemCriterion>,
  performanceTable: IPerformanceTableEntry[]
): boolean {
  return _.some(criteria, (criterion: IProblemCriterion) => {
    return _.some(criterion.dataSources, (dataSource) => {
      const entriesForDataSource = _.filter(performanceTable, [
        'dataSource',
        dataSource.id
      ]);
      return _.some(entriesForDataSource, (entry) => {
        return hasNoneEmptyEffect(entry) || hasNoneEmptyDistribution(entry);
      });
    });
  });
}

function hasNoneEmptyEffect(entry: any): boolean {
  return entry.performance.effect && entry.performance.effect.type !== 'empty';
}

function hasNoneEmptyDistribution(entry: any): boolean {
  return (
    entry.performance.distribution &&
    entry.performance.distribution.type !== 'empty'
  );
}

// function findRowWithoutValuesB(
//   effectsTableInfo,
//   scales: Record<string, Record<string, IScale>>
// ) {
//   return !_.some(effectsTableInfo, function (row, dataSourceId) {
//     return !row.isAbsolute || hasCellWithValue(row, scales, dataSourceId);
//   });
// }

// function hasCellWithValue(
//   row,
//   scales: Record<string, Record<string, IScale>>,
//   dataSourceId
// ) {
//   return _.some(row.studyDataLabelsAndUncertainty, function (
//     cell,
//     alternativeId
//   ) {
//     return (
//       cell.effectValue !== '' ||
//       (scales && scales[dataSourceId][alternativeId]['50%'])
//     );
//   });
// }

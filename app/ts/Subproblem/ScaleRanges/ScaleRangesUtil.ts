import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import _ from 'lodash';

export function getScaleRangeWarnings(problem: IProblem): string[] {
  let warnings: string[] = [];
  if (areTooManyDataSourcesIncluded(problem.criteria)) {
    warnings.push(
      'Multiple data sources selected for at least one criterion, therefore no scales can be set.'
    );
  }
  if (findRowWithoutValues(problem.criteria, problem.performanceTable)) {
    warnings.push(
      'Criterion with only missing or text values selected, therefore no scales can be set.'
    );
  }
  return warnings;
}

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
    return _.some(criterion.dataSources, (dataSource: IProblemDataSource) => {
      const entriesForDataSource: IPerformanceTableEntry[] = _.filter(
        performanceTable,
        ['dataSource', dataSource.id]
      );
      return !_.some(entriesForDataSource, (entry: IPerformanceTableEntry) => {
        return hasNoEmptyEffect(entry) || hasNoEmptyDistribution(entry);
      });
    });
  });
}

function hasNoEmptyEffect(entry: any): boolean {
  return entry.performance.effect && entry.performance.effect.type !== 'empty';
}

function hasNoEmptyDistribution(entry: any): boolean {
  return (
    entry.performance.distribution &&
    entry.performance.distribution.type !== 'empty'
  );
}

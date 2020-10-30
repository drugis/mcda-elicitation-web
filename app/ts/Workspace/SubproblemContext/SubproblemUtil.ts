import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import ISubproblemDefinition from '@shared/interface/ISubproblemDefinition';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import _ from 'lodash';

export function applySubproblem(
  workspace: IOldWorkspace,
  subproblem: IOldSubproblem
): IOldWorkspace {
  const {definition} = subproblem;
  const {alternatives, criteria, performanceTable} = workspace.problem;
  const filteredAlternatives = filterExclusions(
    alternatives,
    definition.excludedAlternatives
  );
  const filteredCriteria = filterExclusions(
    criteria,
    definition.excludedCriteria
  );
  const filteredCriteriaAndDataSources = _.mapValues(
    filteredCriteria,
    (criterion: IProblemCriterion) => {
      return {
        ...criterion,
        dataSources: filterDatasources(
          criterion.dataSources,
          definition.excludedDataSources
        )
      };
    }
  );
  const filteredPerformanceTable = filterPerformanceTable(
    performanceTable,
    definition
  );

  return {
    ...workspace,
    problem: {
      ...workspace.problem,
      alternatives: filteredAlternatives,
      criteria: filteredCriteriaAndDataSources,
      performanceTable: filteredPerformanceTable
    }
  };
}

function filterExclusions<T extends {id: string}>(
  toFilter: Record<string, T>,
  exclusions?: string[]
): Record<string, T> {
  return _.omit(toFilter, exclusions);
}

function filterDatasources(
  dataSources: IProblemDataSource[],
  exclusions: string[]
): IProblemDataSource[] {
  return _.reject(dataSources, (dataSource: IProblemDataSource): boolean => {
    return _.includes(exclusions, dataSource.id);
  });
}

function filterPerformanceTable(
  performanceTable: IPerformanceTableEntry[],
  definition: ISubproblemDefinition
): IPerformanceTableEntry[] {
  return _.reject(
    performanceTable,
    (entry: IPerformanceTableEntry): boolean => {
      return (
        _.includes(definition.excludedCriteria, entry.criterion) ||
        _.includes(definition.excludedAlternatives, entry.alternative) ||
        _.includes(definition.excludedDataSources, entry.dataSource)
      );
    }
  );
}

import ICriterion from '@shared/interface/ICriterion';
import IEffect from '@shared/interface/IEffect';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import ISubproblemDefinition from '@shared/interface/ISubproblemDefinition';
import IWorkspace from '@shared/interface/IWorkspace';
import IRelativeCovarianceMatrix from '@shared/interface/Problem/IRelativeCovarianceMatrix';
import _ from 'lodash';

export function applySubproblem(
  workspace: IWorkspace,
  subproblem: IOldSubproblem
): IWorkspace {
  const {definition} = subproblem;
  const {
    alternatives,
    criteria,
    distributions,
    effects,
    relativePerformances
  } = workspace;
  const filteredAlternatives = filterExclusions(
    alternatives,
    definition.excludedAlternatives
  );
  const filteredCriteria = filterExclusions(
    criteria,
    definition.excludedCriteria
  );
  const filteredCriteriaAndDataSources = _.map(
    filteredCriteria,
    (criterion: ICriterion) => {
      return {
        ...criterion,
        dataSources: filterExclusions(
          criterion.dataSources,
          definition.excludedDataSources
        )
      };
    }
  );
  const filteredEffects = filterAbsolutePerformanceEntries(effects, definition);
  const filteredDistributions = filterAbsolutePerformanceEntries(
    distributions,
    definition
  );
  const filteredRelativePerformances = filterRelativePerformances(
    relativePerformances,
    definition
  );

  return {
    ...workspace,

    alternatives: filteredAlternatives,
    criteria: filteredCriteriaAndDataSources,
    effects: filteredEffects,
    distributions: filteredDistributions,
    relativePerformances: filteredRelativePerformances
  };
}

function filterExclusions<T extends {id: string}>(
  toFilter: T[],
  exclusions?: string[]
): T[] {
  return _.reject(toFilter, (item: T): boolean => {
    return _.includes(exclusions, item.id);
  });
}

function filterAbsolutePerformanceEntries<T extends IEffect>(
  performanceTable: T[],
  definition: ISubproblemDefinition
): T[] {
  return _.reject(performanceTable, (entry: T): boolean => {
    return (
      _.includes(definition.excludedCriteria, entry.criterionId) ||
      _.includes(definition.excludedAlternatives, entry.alternativeId) ||
      _.includes(definition.excludedDataSources, entry.dataSourceId)
    );
  });
}

function filterRelativePerformances(
  relativePerformances: IRelativePerformance[],
  definition: ISubproblemDefinition
): IRelativePerformance[] {
  return _(relativePerformances)
    .reject((entry: IRelativePerformance): boolean => {
      return (
        _.includes(definition.excludedCriteria, entry.criterionId) ||
        _.includes(definition.excludedDataSources, entry.dataSourceId)
      );
    })
    .map(_.partial(cleanUpMatrix, definition.excludedAlternatives))
    .value();
}

function cleanUpMatrix(
  excludedAlternatives: string[],
  relativePerformance: IRelativePerformance
): IRelativePerformance {
  return {
    ...relativePerformance,
    relative: {
      cov: cleanUpCov(relativePerformance.relative.cov, excludedAlternatives),
      mu: cleanUpMu(relativePerformance.relative.mu, excludedAlternatives),
      type: relativePerformance.relative.type
    }
  };
}

function cleanUpCov(
  cov: IRelativeCovarianceMatrix,
  excludedAlternatives: string[]
): IRelativeCovarianceMatrix {
  const excludedIndices = _.map(
    excludedAlternatives,
    (alternativeId: string) => {
      return cov.colnames.indexOf(alternativeId);
    }
  );
  return {
    colnames: _.difference(cov.colnames, excludedAlternatives),
    rownames: _.difference(cov.rownames, excludedAlternatives),
    data: filterData(cov.data, excludedIndices)
  };
}

function filterData(data: number[][], excludedIndices: number[]): number[][] {
  return _(data)
    .reject((_item, idx: number): boolean => {
      return _.includes(excludedIndices, idx);
    })
    .map(_.partial(filterRow, excludedIndices))
    .value();
}

function filterRow(excludedIndices: number[], data: number[]): number[] {
  return _.reject(data, (_item, idx: number): boolean => {
    return _.includes(excludedIndices, idx);
  });
}

function cleanUpMu(
  mu: Record<string, number>,
  excludedAlternatives: string[]
): Record<string, number> {
  return _.omit(mu, excludedAlternatives);
}

export function getMagnitude(
  [lowerConfiguredValue, upperConfiguredValue]: [number, number],
  predefinedStepSize: number | undefined
): number {
  if (predefinedStepSize) {
    return Math.log10(predefinedStepSize);
  } else {
    const interval = upperConfiguredValue - lowerConfiguredValue;
    const magnitude = Math.floor(Math.log10(interval)) - 1;
    return magnitude;
  }
}

export function getStepSize(
  [lowerConfiguredValue, upperConfiguredValue]: [number, number],
  predefinedStepSize: number | undefined
) {
  if (predefinedStepSize) {
    return predefinedStepSize;
  } else {
    const magnitude = getMagnitude(
      [lowerConfiguredValue, upperConfiguredValue],
      predefinedStepSize
    );
    return Math.pow(10, magnitude);
  }
}

export function hasNoRange(
  ranges: Record<string, [number, number]>,
  dataSourceId: string
): boolean {
  return _.isEqual(ranges, {}) || _.isEqual(ranges[dataSourceId], {});
}

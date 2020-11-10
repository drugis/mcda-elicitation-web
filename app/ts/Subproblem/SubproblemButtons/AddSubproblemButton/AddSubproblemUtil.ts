import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import ISubproblemDefinition from '@shared/interface/ISubproblemDefinition';
import IWorkspace from '@shared/interface/IWorkspace';
import {getTitleError} from 'app/ts/util/getTitleError';
import _ from 'lodash';
import {getSliderLimits} from './AddSubproblemScaleRanges/AddSubproblemScaleRangesUtil';

export function getMissingValueWarnings(
  dataSourceInclusions: Record<string, boolean>,
  alternativeInclusions: Record<string, boolean>,
  workspace: IWorkspace
): string[] {
  const warnings: string[] = [];
  const includedDataSourceIds = _.keys(_.pickBy(dataSourceInclusions));
  const includedAlternativeIds = _.keys(_.pickBy(alternativeInclusions));
  const noSmaaWarning =
    'Some cell(s) are missing SMAA values. Deterministic values will be used for these cell(s).';
  const noDeterministicWarning =
    'Some cell(s) are missing deterministic values. SMAA values will be used for these cell(s).';

  if (
    hasMissingValues(
      workspace,
      includedDataSourceIds,
      includedAlternativeIds,
      true
    )
  ) {
    warnings.push(noDeterministicWarning);
  }

  if (
    hasMissingValues(
      workspace,
      includedDataSourceIds,
      includedAlternativeIds,
      false
    )
  ) {
    warnings.push(noSmaaWarning);
  }

  return warnings;
}

function hasMissingValues(
  workspace: IWorkspace,
  includedDataSourceIds: string[],
  includedAlternativeIds: string[],
  isEffect: boolean
) {
  return _.some(includedDataSourceIds, (dataSourceId) => {
    return _.some(
      includedAlternativeIds,
      _.partial(hasMissingValue, workspace, isEffect, dataSourceId)
    );
  });
}

function hasMissingValue(
  workspace: IWorkspace,
  isEffect: boolean,
  dataSourceId: string,
  alternativeId: string
): boolean {
  const [effect, distribution, relativePerformance] = findPerformances(
    workspace,
    dataSourceId,
    alternativeId
  );
  const hasRelativePerformance = !!relativePerformance;
  if (isEffect) {
    return (
      !hasPerformance(effect) &&
      (hasPerformance(distribution) || hasRelativePerformance)
    );
  } else {
    return (
      !hasPerformance(distribution) &&
      !hasRelativePerformance &&
      hasPerformance(effect)
    );
  }
}

function findPerformances(
  workspace: IWorkspace,
  dataSourceId: string,
  alternativeId: string
): [Effect, Distribution, IRelativePerformance] {
  const effect = findPerformance(
    workspace.effects,
    dataSourceId,
    alternativeId
  );
  const distribution = findPerformance(
    workspace.distributions,
    dataSourceId,
    alternativeId
  );
  const relativePerformance = findRelativePerformance(
    workspace.relativePerformances,
    dataSourceId
  );
  return [effect, distribution, relativePerformance];
}

function findPerformance<
  T extends {dataSourceId: string; alternativeId: string}
>(items: T[], dataSourceId: string, alternativeId: string): T {
  return _.find(items, (item: T) => {
    return (
      item.dataSourceId === dataSourceId && item.alternativeId === alternativeId
    );
  });
}

function findRelativePerformance(
  items: IRelativePerformance[],
  dataSourceId: string
): IRelativePerformance {
  return _.find(items, (item: IRelativePerformance) => {
    return item.dataSourceId === dataSourceId;
  });
}

function hasPerformance(performance: Effect | Distribution) {
  return (
    performance && performance.type !== 'empty' && performance.type !== 'text'
  );
}

export function initInclusions<T extends {id: string}>(
  items: Record<string, T>,
  exclusions?: string[]
): Record<string, boolean> {
  return _.mapValues(items, (item: T) => {
    return !exclusions || !_.includes(exclusions, item.id);
  });
}

export function getScaleBlockingWarnings(
  criterionInclusions: Record<string, boolean>,
  dataSourceInclusions: Record<string, boolean>,
  alternativeInclusions: Record<string, boolean>,
  workspace: IWorkspace
): string[] {
  let warnings: string[] = [];
  if (
    areValuesMissingInEffectsTable(
      workspace,
      dataSourceInclusions,
      alternativeInclusions
    )
  ) {
    warnings.push('Effects table contains missing values');
  }
  if (
    areTooManyDataSourcesSelected(
      _.keyBy(workspace.criteria, 'id'),
      criterionInclusions,
      dataSourceInclusions
    )
  ) {
    warnings.push('Effects table contains multiple data sources per criterion');
  }
  return warnings;
}

function areValuesMissingInEffectsTable(
  workspace: IWorkspace,
  dataSourceInclusions: Record<string, boolean>,
  alternativeInclusions: Record<string, boolean>
): boolean {
  const includedDataSourceIds = _.keys(_.pickBy(dataSourceInclusions));
  const includedAlternativeIds = _.keys(_.pickBy(alternativeInclusions));

  return _.some(includedDataSourceIds, (dataSourceId) => {
    return _.some(includedAlternativeIds, (alternativeId) => {
      const [effect, distribution, relativePerformance] = findPerformances(
        workspace,
        dataSourceId,
        alternativeId
      );

      return (
        !hasPerformance(effect) &&
        !hasPerformance(distribution) &&
        !relativePerformance
      );
    });
  });
}

function areTooManyDataSourcesSelected(
  criteria: Record<string, ICriterion>,
  criterionInclusions: Record<string, boolean>,
  dataSourceInclusions: Record<string, boolean>
): boolean {
  const includedCriterionIds = _.keys(_.pickBy(criterionInclusions));
  return _.some(includedCriterionIds, (criterionId) => {
    const criterion = criteria[criterionId];
    const numberOfSelectedDataSources = getNumberOfSelectedDataSources(
      criterion.dataSources,
      dataSourceInclusions
    );
    return numberOfSelectedDataSources > 1;
  });
}

function getNumberOfSelectedDataSources(
  dataSources: IDataSource[],
  dataSourceInclusions: Record<string, boolean>
) {
  return _.countBy(dataSources, (dataSource) => {
    return dataSourceInclusions[dataSource.id];
  }).true;
}

export function isAlternativeDeselectionDisabled(
  id: string,
  alternativeInclusions: Record<string, boolean>,
  baselineMap: Record<string, boolean>
) {
  return (
    _.filter(alternativeInclusions).length < 3 || isBaseline(id, baselineMap)
  );
}

function isBaseline(id: string, baselineMap: Record<string, boolean>): boolean {
  return baselineMap[id];
}

export function getBaselineMap(
  alternatives: Record<string, IAlternative>,
  relativePerformances: IRelativePerformance[]
): Record<string, boolean> {
  return _.mapValues(alternatives, (alternative) => {
    return _.some(relativePerformances, (relativePerformance) => {
      return alternative.id === relativePerformance.baseline.id;
    });
  });
}

export function isDataSourceDeselectionDisabled(
  criterion: ICriterion,
  dataSourceInclusions: Record<string, boolean>,
  criterionInclusions: Record<string, boolean>
): boolean {
  const numberOfSelectedDataSources = _.countBy(
    criterion.dataSources,
    (dataSource) => {
      return dataSourceInclusions[dataSource.id];
    }
  ).true;
  return numberOfSelectedDataSources < 2 || !criterionInclusions[criterion.id];
}

export function initConfiguredRanges(
  dataSourcesById: Record<string, IDataSource>,
  observedRanges: Record<string, [number, number]>,
  definitionRanges?: Record<string, [number, number]>
): Record<string, [number, number]> {
  return _.mapValues(dataSourcesById, (dataSource: IDataSource) => {
    const configuredRange: [number, number] =
      definitionRanges && definitionRanges[dataSource.id]
        ? definitionRanges[dataSource.id]
        : observedRanges[dataSource.id];
    return getSliderLimits(observedRanges[dataSource.id], configuredRange);
  });
}

export function createSubproblemDefinition(
  criterionInclusions: Record<string, boolean>,
  dataSourceInclusions: Record<string, boolean>,
  alternativeInclusions: Record<string, boolean>,
  configuredRanges: Record<string, [number, number]>,
  stepSizes: Record<string, number>
): ISubproblemDefinition {
  return {
    excludedCriteria: getExclusions(criterionInclusions),
    excludedDataSources: getExclusions(dataSourceInclusions),
    excludedAlternatives: getExclusions(alternativeInclusions),
    ranges: getConfiguredRanges(configuredRanges, dataSourceInclusions),
    stepSizes: getStepSizes(stepSizes, dataSourceInclusions)
  };
}

function getExclusions(items: Record<string, boolean>): string[] {
  return _(items)
    .omitBy((value) => {
      return value;
    })
    .keys()
    .value();
}

function getConfiguredRanges(
  configuredRanges: Record<string, [number, number]>,
  dataSourceInclusions: Record<string, boolean>
): Record<string, [number, number]> {
  return _.pickBy(configuredRanges, (range, dataSourceId) => {
    return dataSourceInclusions[dataSourceId];
  });
}

function getStepSizes(
  stepSizes: Record<string, number>,
  dataSourceInclusions: Record<string, boolean>
): Record<string, number> {
  return _.pickBy(stepSizes, (stepSize, dataSourceId) => {
    return dataSourceInclusions[dataSourceId];
  });
}

export function getSubproblemTitleError(
  title: string,
  subproblems: Record<string, IOldSubproblem>
): string[] {
  const titleError: string = getTitleError(title, subproblems);
  if (titleError) {
    return [titleError];
  } else {
    return [];
  }
}

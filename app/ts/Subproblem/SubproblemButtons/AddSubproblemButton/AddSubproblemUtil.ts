import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import IWorkspace from '@shared/interface/IWorkspace';
import _ from 'lodash';

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
    return _.some(includedAlternativeIds, (alternativeId) => {
      const [effect, distribution, relativePerformance] = findPerformances(
        workspace,
        dataSourceId,
        alternativeId
      );

      if (isEffect) {
        return (
          !hasPerformance(effect) &&
          (hasPerformance(distribution) || relativePerformance)
        );
      } else {
        return (
          !hasPerformance(distribution) &&
          !relativePerformance &&
          hasPerformance(effect)
        );
      }
    });
  });
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

export function isAlternativeDisabled(
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

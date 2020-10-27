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
      const [
        effect,
        distribution,
        relativePerformance
      ] = findEffectAndDistribution(workspace, dataSourceId, alternativeId);

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

function findEffectAndDistribution(
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
  const includedDataSources: IDataSource[] = _.flatMap(
    workspace.criteria,
    (criterion) => {
      return _.filter(criterion.dataSources, (dataSource) => {
        return dataSourceInclusions[dataSource.id];
      });
    }
  );
  return _.some(includedDataSources, (dataSource) => {
    return _.some(workspace.alternatives, (alternative) => {
      const effectForCoordinates = _.find(workspace.effects, (effect) => {
        return (
          effect.dataSourceId === dataSource.id &&
          effect.alternativeId === alternative.id
        );
      });
      const distributionForCoordinates = _.find(
        workspace.distributions,
        (distribution) => {
          return (
            distribution.dataSourceId === dataSource.id &&
            distribution.alternativeId === alternative.id
          );
        }
      );
      return (
        alternativeInclusions[alternative.id] &&
        hasEmptyEffect(effectForCoordinates) &&
        hasEmptyDistribution(distributionForCoordinates)
      );
    });
  });
}

function hasEmptyEffect(effect: Effect): boolean {
  return !effect || effect.type === 'empty' || effect.type === 'text';
}

function hasEmptyDistribution(distribution: Distribution): boolean {
  return (
    !distribution ||
    distribution.type === 'empty' ||
    distribution.type === 'text'
  );
}

function areTooManyDataSourcesSelected(
  criteria: Record<string, ICriterion>,
  criterionInclusions: Record<string, boolean>,
  dataSourceInclusions: Record<string, boolean>
): boolean {
  return _.some(criterionInclusions, (criterionInclusion, criterionId) => {
    const criterion = criteria[criterionId];
    const numberOfSelectedDataSources = _.countBy(
      criterion.dataSources,
      (dataSource) => {
        return dataSourceInclusions[dataSource.id];
      }
    ).true;
    return criterionInclusion && numberOfSelectedDataSources > 1;
  });
}

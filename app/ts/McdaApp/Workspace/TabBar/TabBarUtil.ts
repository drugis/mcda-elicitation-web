import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import IWorkspace from '@shared/interface/IWorkspace';
import IPvf from '@shared/interface/Problem/IPvf';
import _ from 'lodash';
import {TTab} from './TTab';

export function findMissingValue({
  criteria,
  alternatives,
  effects,
  distributions,
  relativePerformances
}: IWorkspace): boolean {
  return _.some(criteria, (criterion: ICriterion) =>
    _.some(alternatives, (alternative: IAlternative) => {
      const effect = findPerformance(
        effects,
        criterion.dataSources[0].id,
        alternative.id
      );
      const distribution = findPerformance(
        distributions,
        criterion.dataSources[0].id,
        alternative.id
      );
      const relativePerformance = findRelativePerformance(
        relativePerformances,
        criterion.dataSources[0].id
      );
      return (
        hasNonValueEffect(effect, distribution, relativePerformance) ||
        hasNonValueDistribution(effect, distribution, relativePerformance) ||
        hasNovalue(effect, distribution, relativePerformance)
      );
    })
  );
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

function hasNonValueEffect(
  effect: Effect,
  distribution: Distribution,
  relativePerformance: IRelativePerformance
): boolean {
  return (
    effect &&
    (effect.type === 'empty' || effect.type === 'text') &&
    !distribution &&
    !relativePerformance
  );
}

function hasNonValueDistribution(
  effect: Effect,
  distribution: Distribution,
  relativePerformance: IRelativePerformance
): boolean {
  return (
    distribution &&
    (distribution.type === 'empty' || distribution.type === 'text') &&
    !effect &&
    !relativePerformance
  );
}

function hasNovalue(
  effect: Effect,
  distribution: Distribution,
  relativePerformance: IRelativePerformance
): boolean {
  return (
    effect &&
    (effect.type === 'empty' || effect.type === 'text') &&
    distribution &&
    (distribution.type === 'empty' || distribution.type === 'text') &&
    !relativePerformance
  );
}

export function findMissingPvfs(
  pvfs: Record<string, IPvf>,
  criteria: ICriterion[]
): boolean {
  return (
    _.isEmpty(pvfs) ||
    _.some(criteria, (criterion: ICriterion) => !pvfs[criterion.id])
  );
}

export function findCriterionWithTooManyDataSources(
  criteria: ICriterion[]
): boolean {
  return _.some(
    criteria,
    (criterion: ICriterion) => criterion.dataSources.length > 1
  );
}

export function isTTab(tab: string): tab is TTab {
  return (
    tab === 'overview' ||
    tab === 'problem' ||
    tab === 'preferences' ||
    tab === 'deterministic-results' ||
    tab === 'smaa-results'
  );
}

export function isAnyObservableRangeWidthZero(
  observedRanges: Record<string, [number, number]>
): boolean {
  return _.some(
    observedRanges,
    (observedRange) => observedRange[0] === observedRange[1]
  );
}

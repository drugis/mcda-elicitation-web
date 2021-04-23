import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IWorkspace from '@shared/interface/IWorkspace';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import _ from 'lodash';

export function getScaleRangeWarnings(
  workspace: IWorkspace,
  observedRanges: Record<string, [number, number]>
): string[] {
  let warnings: string[] = [];
  if (areTooManyDataSourcesIncluded(workspace.criteria)) {
    warnings.push(
      'Multiple data sources selected for at least one criterion, therefore no scales can be set.'
    );
  }
  if (findRowWithoutValues(workspace)) {
    warnings.push(
      'Criterion with only missing or text values selected, therefore no scales can be set.'
    );
  }
  if (hasRowWithOnlySameValue(workspace.criteria, observedRanges)) {
    warnings.push(
      'Criterion selected where all values are identical, therefore no scales can be set.'
    );
  }
  return warnings;
}

export function areTooManyDataSourcesIncluded(criteria: ICriterion[]): boolean {
  return _.some(criteria, function (criterion: IProblemCriterion) {
    return criterion.dataSources.length > 1;
  });
}

export function findRowWithoutValues(workspace: IWorkspace): boolean {
  return _.some(workspace.criteria, (criterion: IProblemCriterion) => {
    return _.some(criterion.dataSources, (dataSource: IProblemDataSource) => {
      const effectsForDataSource = _.filter(workspace.effects, [
        'dataSourceId',
        dataSource.id
      ]);
      const distributionsForDataSource = _.filter(workspace.distributions, [
        'dataSourceId',
        dataSource.id
      ]);
      const relativesForDataSource = _.filter(workspace.relativePerformances, [
        'dataSourceId',
        dataSource.id
      ]);

      return !(
        hasNonEmptyPerformance(effectsForDataSource) ||
        hasNonEmptyPerformance(distributionsForDataSource) ||
        relativesForDataSource.length
      );
    });
  });
}

function hasNonEmptyPerformance(effects: Effect[] | Distribution[]): boolean {
  return _.some(effects, (effect: Effect | Distribution) => {
    return effect.type !== 'text' && effect.type !== 'empty';
  });
}

export function hasRowWithOnlySameValue(
  criteria: ICriterion[],
  observedRanges: Record<string, [number, number]>
): boolean {
  return _.some(
    criteria,
    (criterion: ICriterion): boolean =>
      observedRanges[criterion.dataSources[0].id] &&
      observedRanges[criterion.dataSources[0].id][0] ===
        observedRanges[criterion.dataSources[0].id][1]
  );
}

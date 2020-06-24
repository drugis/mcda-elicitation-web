import _ from 'lodash';
import IAlternative from '../../interface/IAlternative';
import ICriterion from '../../interface/ICriterion';
import {Distribution} from '../../interface/IDistribution';
import {Effect} from '../../interface/IEffect';
import INormalDistribution from '../../interface/INormalDistribution';
import IValueCIEffect from '../../interface/IValueCIEffect';
import IValueEffect from '../../interface/IValueEffect';
import significantDigits from '../Util/significantDigits';

export function generateUuid(): string {
  let pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createDistributions(
  distributions: Record<string, Record<string, Distribution>>,
  effects: Record<string, Record<string, Effect>>
): Record<string, Record<string, Distribution>> {
  let distributionsCopy = _.cloneDeep(distributions);
  _.forEach(effects, (row: Record<string, Effect>, dataSourceId: string) => {
    _.forEach(row, (effect: Effect, alternativeId: string) => {
      const newDistribution = generateDistribution(effect);
      if (!distributionsCopy[dataSourceId]) {
        distributionsCopy[dataSourceId] = {};
      }
      distributionsCopy[dataSourceId][alternativeId] = newDistribution;
    });
  });
  return distributionsCopy;
}

function generateDistribution(effect: Effect): Distribution {
  switch (effect.type) {
    case 'valueCI':
      return generateValueCIDistribution(effect);
    default:
      return _.cloneDeep(effect);
  }
}

export function generateValueCIDistribution(
  effect: IValueCIEffect
): INormalDistribution | IValueEffect {
  if (areBoundsSymmetric(effect)) {
    return createNormalDistribution(effect);
  } else {
    return createValueDistribution(effect);
  }
}

export function areBoundsSymmetric(effect: IValueCIEffect): boolean {
  return (
    Math.abs(
      1 -
        (effect.value - effect.lowerBound) / (effect.upperBound - effect.value)
    ) < 0.05
  );
}

export function createNormalDistribution(
  effect: IValueCIEffect
): INormalDistribution {
  return {
    alternativeId: effect.alternativeId,
    dataSourceId: effect.dataSourceId,
    criterionId: effect.criterionId,
    mean: effect.value,
    type: 'normal',
    standardError: boundsToStandardError(effect.lowerBound, effect.upperBound)
  };
}

export function boundsToStandardError(lowerBound: number, upperBound: number) {
  return significantDigits((upperBound - lowerBound) / (2 * 1.96));
}

export function createValueDistribution(effect: IValueCIEffect): IValueEffect {
  return {
    alternativeId: effect.alternativeId,
    dataSourceId: effect.dataSourceId,
    criterionId: effect.criterionId,
    value: effect.value,
    type: 'value'
  };
}

export function createWarnings(
  title: string,
  criteria: ICriterion[],
  alternatives: IAlternative[]
) {
  let newWarnings: string[] = [];
  if (!title) {
    newWarnings.push('No title entered');
  }
  if (criteria.length < 2) {
    newWarnings.push('At least two criteria are required');
  }
  if (alternatives.length < 2) {
    newWarnings.push('At least two alternatives are required');
  }
  if (isDataSourceMissing(criteria)) {
    newWarnings.push('All criteria require at least one reference');
  }
  if (hasDuplicateTitle(criteria)) {
    newWarnings.push('Criteria must have unique titles');
  }
  if (hasDuplicateTitle(alternatives)) {
    newWarnings.push('Alternatives must have unique titles');
  }
  if (hasEmptyTitle(criteria)) {
    newWarnings.push('Criteria must have a title');
  }
  if (hasEmptyTitle(alternatives)) {
    newWarnings.push('Alternatives must have a title');
  }
  // each datasource/alternative pair should have at least an effect or a distribution ? Douwe

  return newWarnings;
}

function hasEmptyTitle<T>(items: T[]): boolean {
  return _.some(items, {title: ''});
}

function isDataSourceMissing(criteria: ICriterion[]): boolean {
  return _.some(criteria, (criterion: ICriterion) => {
    return !criterion.dataSources.length;
  });
}

function hasDuplicateTitle(list: ICriterion[] | IAlternative[]): boolean {
  return _.uniqBy(list, 'title').length !== list.length;
}

export function swapItems<T>(id1: string, id2: string, items: T[]): T[] {
  const index1 = _.findIndex(items, ['id', id1]);
  const index2 = _.findIndex(items, ['id', id2]);
  let itemsCopy = _.cloneDeep(items);
  // ES6 swap trick below, don't even worry about it
  [itemsCopy[index1], itemsCopy[index2]] = [
    itemsCopy[index2],
    itemsCopy[index1]
  ];
  return itemsCopy;
}

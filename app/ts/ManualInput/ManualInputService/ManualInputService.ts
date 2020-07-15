import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import _ from 'lodash';
import {hasInvalidCell} from '../CellValidityService/CellValidityService';
import significantDigits from '../Util/significantDigits';

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

export function generateDistribution(effect: Effect): Distribution {
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
  if (
    !effect.isNotEstimableLowerBound &&
    !effect.isNotEstimableUpperBound &&
    areBoundsSymmetric(effect)
  ) {
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
  alternatives: IAlternative[],
  effects: Record<string, Record<string, Effect>>,
  distributions: Record<string, Record<string, Distribution>>
): string[] {
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
  if (
    hasInvalidCell(effects, criteria, alternatives) &&
    hasInvalidCell(distributions, criteria, alternatives)
  ) {
    newWarnings.push(
      'Either effects or distributions must be fully filled out'
    );
  }
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

export function replaceUndefinedBounds(criteria: ICriterion[]): ICriterion[] {
  return _.map(criteria, (criterion) => {
    return {
      ...criterion,
      dataSources: replaceBoundsOnDataSources(criterion.dataSources)
    };
  });
}

function replaceBoundsOnDataSources(dataSources: IDataSource[]): IDataSource[] {
  return _.map(dataSources, (dataSource) => {
    return {
      ...dataSource,
      unitOfMeasurement: {
        ...dataSource.unitOfMeasurement,
        lowerBound: getBound(
          dataSource.unitOfMeasurement.lowerBound,
          -Infinity
        ),
        upperBound: getBound(dataSource.unitOfMeasurement.upperBound, +Infinity)
      }
    };
  });
}

function getBound(bound: number, defaultBound: number) {
  if (bound === undefined) {
    return defaultBound;
  } else {
    return bound;
  }
}

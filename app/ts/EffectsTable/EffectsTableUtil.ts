import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import _ from 'lodash';

export function canDSBePercentage(
  criteria: ICriterion[],
  dataSourceId: string
): boolean {
  const unitType = _(criteria).flatMap('dataSources').find(['id', dataSourceId])
    .unitOfMeasurement.type;
  return unitType === 'decimal' || unitType === 'percentage';
}

export function findValue<T extends Effect | Distribution>(
  items: T[],
  dataSourceId: string,
  alternativeId: string
): T {
  return _.find(items, (item: T) => {
    return (
      item.alternativeId === alternativeId && item.dataSourceId === dataSourceId
    );
  });
}

export function findScale(
  scales: Record<string, Record<string, IScale>>,
  dataSourceId: string,
  alternativeId: string
): IScale {
  if (scales[dataSourceId] && scales[dataSourceId][alternativeId]) {
    return scales[dataSourceId][alternativeId];
  } else {
    return undefined;
  }
}

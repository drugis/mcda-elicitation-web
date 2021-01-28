import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IOrdering from '@shared/interface/IOrdering';
import IScale from '@shared/interface/IScale';
import _ from 'lodash';
import {swapItems} from '../ManualInput/ManualInputService/ManualInputService';

export function hasScaleValues(
  scales: Record<string, Record<string, IScale>>
): boolean {
  return _.some(scales, (scale) => hasScale(scale));
}

export function hasScale(scales: Record<string, IScale>): boolean {
  return _.some(scales, (scale) => hasValue(scale));
}

function hasValue(scale: IScale) {
  return _.some(scale, (value) => !_.isNull(value));
}

export function isOrdering(ordering: {} | IOrdering): ordering is IOrdering {
  return (
    _.difference(['criteria', 'alternatives', 'dataSources'], _.keys(ordering))
      .length === 0
  );
}

export function createNewOrdering(
  alternatives: IAlternative[],
  criteria: ICriterion[]
): IOrdering {
  return {
    alternatives: _.map(alternatives, 'id'),
    criteria: _.map(criteria, 'id'),
    dataSources: _.flatMap(criteria, (criterion: ICriterion): string[] =>
      _.map(criterion.dataSources, 'id')
    )
  };
}

export function createCriteriaWithSwappedDataSources(
  criteria: ICriterion[],
  criterionId: string,
  dataSource1Id: string,
  dataSource2Id: string
): ICriterion[] {
  const criterionIndex = _.findIndex(criteria, ['id', criterionId]);
  const criterion = criteria[criterionIndex];
  const newCriterion = {
    ...criterion,
    dataSources: swapItems(dataSource1Id, dataSource2Id, criterion.dataSources)
  };
  let newCriteria = _.cloneDeep(criteria);
  newCriteria[criterionIndex] = newCriterion;
  return newCriteria;
}

import ICriterion from '@shared/interface/ICriterion';
import _ from 'lodash';

export function generateUuid(): string {
  let pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getDataSourcesById(criteria: Record<string, ICriterion>) {
  return _(criteria)
    .flatMap((criterion: ICriterion) => {
      return criterion.dataSources;
    })
    .keyBy('id')
    .value();
}

import ICriterion from '@shared/interface/ICriterion';
import _ from 'lodash';

export function getDataSourcesById(criteria: Record<string, ICriterion>) {
  return _(criteria)
    .flatMap((criterion: ICriterion) => {
      return criterion.dataSources;
    })
    .keyBy('id')
    .value();
}

import ICriterion from '@shared/interface/ICriterion';
import _ from 'lodash';

export function canDSBePercentage(
  criteria: ICriterion[],
  dataSourceId: string
): boolean {
  const unitType = _(criteria).flatMap('dataSources').find(['id', dataSourceId])
    .unitOfMeasurement.type;
  return unitType === 'decimal' || unitType === 'percentage';
}

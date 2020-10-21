import ICriterion from '@shared/interface/ICriterion';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import _ from 'lodash';

const {decimal, percentage} = UnitOfMeasurementType;

export function canBePercentage(
  criteria: ICriterion[],
  dataSourceId: string
): boolean {
  const unitType = _(criteria).flatMap('dataSources').find(['id', dataSourceId])
    .unitOfMeasurement.type;
  return unitType === decimal || unitType === percentage;
}

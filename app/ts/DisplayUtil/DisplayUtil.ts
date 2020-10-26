import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import significantDigits from '../ManualInput/Util/significantDigits';

export function getPercentifiedValue(
  value: number,
  showPercentages: boolean
): string {
  if (showPercentages) {
    return significantDigits(value * 100).toString();
  } else {
    return significantDigits(value).toString();
  }
}

export function canBePercentage(unitType: UnitOfMeasurementType) {
  return unitType === 'percentage' || unitType === 'decimal';
}

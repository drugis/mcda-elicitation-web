import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import significantDigits from '../ManualInput/Util/significantDigits';

export function getPercentifiedValue(
  value: number,
  showPercentages: boolean
): number {
  if (showPercentages) {
    return significantDigits(value * 100);
  } else {
    return significantDigits(value);
  }
}

export function getPercentifiedValueLabel(
  value: number,
  showPercentages: boolean
): string {
  return getPercentifiedValue(value, showPercentages).toString();
}

export function canBePercentage(unitType: UnitOfMeasurementType) {
  return unitType === 'percentage' || unitType === 'decimal';
}

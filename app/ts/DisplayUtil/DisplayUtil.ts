import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import significantDigits from '../ManualInput/Util/significantDigits';

export function getPercentifiedValue(
  value: number,
  usePercentage: boolean
): number {
  if (usePercentage) {
    return significantDigits(value * 100);
  } else {
    return significantDigits(value);
  }
}

export function getPercentifiedValueLabel(
  value: number,
  usePercentage: boolean
): string {
  return getPercentifiedValue(value, usePercentage).toString();
}

export function canBePercentage(unitType: UnitOfMeasurementType): boolean {
  return unitType === 'percentage' || unitType === 'decimal';
}

export function valueToString(
  value: number,
  showPercentage: boolean,
  unitOfMeasurementType: UnitOfMeasurementType
): string {
  if (value === undefined) {
    return 'No value entered';
  } else if (showPercentage) {
    const modifier = unitOfMeasurementType === 'decimal' ? 100 : 1;
    return significantDigits(value * modifier).toString();
  } else {
    const modifier = unitOfMeasurementType === 'percentage' ? 0.01 : 1;
    return significantDigits(value * modifier).toString();
  }
}

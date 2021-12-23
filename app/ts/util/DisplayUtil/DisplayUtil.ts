import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import significantDigits from '../significantDigits';

export function getPercentifiedValue(
  value: number,
  usePercentage: boolean
): number {
  if (usePercentage) {
    return significantDigits(significantDigits(value) * 100); //2 sigdits to ensure the precision stays the same
  } else {
    return significantDigits(value);
  }
}

export function getDepercentifiedValue(
  value: number,
  usePercentage: boolean
): number {
  if (usePercentage) {
    return significantDigits(value / 100);
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
  const usePercentage =
    showPercentage && canBePercentage(unitOfMeasurementType);
  if (value === undefined) {
    return 'No value entered';
  } else {
    return getPercentifiedValueLabel(value, usePercentage);
  }
}

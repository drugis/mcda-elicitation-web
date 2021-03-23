import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import IProblemUnitOfMeasurement from '@shared/interface/Problem/IProblemUnitOfMeasurement';

export function getUnitLabel(
  unit: IUnitOfMeasurement | IProblemUnitOfMeasurement,
  showPercentages: boolean
): string {
  if (showPercentages && unit.type === 'decimal') {
    return '%';
  } else if (!showPercentages && unit.type === 'percentage') {
    return '';
  } else {
    return unit.label;
  }
}

export function getUnitLabelNullsafe(
  unitOfMeasurement: IUnitOfMeasurement | IProblemUnitOfMeasurement,
  showPercentages: boolean
): string {
  const unitLabel = getUnitLabel(unitOfMeasurement, showPercentages);
  return unitLabel ? `(${unitLabel})` : '';
}

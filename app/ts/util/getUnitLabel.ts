import IUnitOfMeasurement, {
  UnitOfMeasurementType
} from '@shared/interface/IUnitOfMeasurement';

export function getUnitLabel(
  unit: IUnitOfMeasurement,
  showPercentages: boolean
): string {
  if (showPercentages && unit.type === UnitOfMeasurementType.decimal) {
    return '%';
  } else if (
    !showPercentages &&
    unit.type === UnitOfMeasurementType.percentage
  ) {
    return '';
  } else {
    return unit.label;
  }
}

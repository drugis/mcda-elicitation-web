export type UnitOfMeasurementType = 'custom' | 'percentage' | 'decimal';

export default interface IUnitOfMeasurement {
  label: string;
  type: UnitOfMeasurementType;
  lowerBound: number;
  upperBound: number;
}

export enum UnitOfMeasurementType {
  custom = 'custom',
  percentage = 'percentage',
  decimal = 'decimal'
}

export default interface IUnitOfMeasurement {
  label: string;
  type: UnitOfMeasurementType;
  lowerBound?: number;
  upperBound?: number;
}

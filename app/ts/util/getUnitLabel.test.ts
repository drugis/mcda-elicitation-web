import IUnitOfMeasurement, {
  UnitOfMeasurementType
} from '@shared/interface/IUnitOfMeasurement';
import {getUnitLabel} from './getUnitLabel';

describe('getUnitLabel', () => {
  it('should return % if showing percentages and unit type is decimal', () => {
    const unit = {type: UnitOfMeasurementType.decimal} as IUnitOfMeasurement;
    const showPercentages = true;
    const result = getUnitLabel(unit, showPercentages);
    expect(result).toEqual('%');
  });

  it('should return % if showing percentages and unit type is percentage', () => {
    const unit = {
      type: UnitOfMeasurementType.percentage,
      label: '%'
    } as IUnitOfMeasurement;
    const showPercentages = true;
    const result = getUnitLabel(unit, showPercentages);
    expect(result).toEqual('%');
  });

  it('should return unit label if unit type is custom', () => {
    const unit = {
      type: UnitOfMeasurementType.custom,
      label: 'custom'
    } as IUnitOfMeasurement;
    const showPercentages = true;
    const result = getUnitLabel(unit, showPercentages);
    expect(result).toEqual('custom');
  });

  it('should return an empty string if unit type is percentage but percetages are not shown', () => {
    const unit = {
      type: UnitOfMeasurementType.percentage
    } as IUnitOfMeasurement;
    const showPercentages = false;
    const result = getUnitLabel(unit, showPercentages);
    expect(result).toEqual('');
  });

  it('should return an empty string if unit type is decimal but percetages are shown', () => {
    const unit = {
      type: UnitOfMeasurementType.percentage,
      label: ''
    } as IUnitOfMeasurement;
    const showPercentages = false;
    const result = getUnitLabel(unit, showPercentages);
    expect(result).toEqual('');
  });
});

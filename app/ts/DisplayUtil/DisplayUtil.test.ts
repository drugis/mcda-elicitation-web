import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import {
  canBePercentage,
  getPercentifiedValueLabel,
  valueToString
} from './DisplayUtil';

describe('displayUtil', () => {
  describe('getPercentifiedValueLabel', () => {
    it('should return a percentified value if it should show percentages', () => {
      const value = 0.010001;
      const result = getPercentifiedValueLabel(value, true);
      expect(result).toEqual('1');
    });

    it('should return a string of the original value if it should not show percentages', () => {
      const value = 1;
      const result = getPercentifiedValueLabel(value, false);
      expect(result).toEqual('1');
    });
  });

  describe('canBePercentage', () => {
    it('should return true if unit type is percentage', () => {
      const unitType: UnitOfMeasurementType = 'percentage';
      const result = canBePercentage(unitType);
      expect(result).toBeTruthy();
    });

    it('should return true if unit type is decimal', () => {
      const unitType: UnitOfMeasurementType = 'decimal';
      const result = canBePercentage(unitType);
      expect(result).toBeTruthy();
    });

    it('should return false if unit type is custom', () => {
      const unitType: UnitOfMeasurementType = 'custom';
      const result = canBePercentage(unitType);
      expect(result).toBeFalsy();
    });
  });

  describe('valueToString', () => {
    it('should return a "no value" label if value is undefined', () => {
      const value: number = undefined;
      const showPercentage = true;
      const unitType: UnitOfMeasurementType = 'custom';
      const result = valueToString(value, showPercentage, unitType);
      const expectedResult = 'No value entered';
      expect(result).toEqual(expectedResult);
    });

    it('should return a modified value if unit type is decimal and percentages are shown', () => {
      const value: number = 1;
      const showPercentage = true;
      const unitType: UnitOfMeasurementType = 'decimal';
      const result = valueToString(value, showPercentage, unitType);
      const expectedResult = '100';
      expect(result).toEqual(expectedResult);
    });

    it('should return a string value if unit type is not decimal and percentages are shown', () => {
      const value: number = 1;
      const showPercentage = true;
      const unitType: UnitOfMeasurementType = 'custom';
      const result = valueToString(value, showPercentage, unitType);
      const expectedResult = '1';
      expect(result).toEqual(expectedResult);
    });

    it('should return a modified value if unit type is percentage and percentages are not shown', () => {
      const value: number = 1;
      const showPercentage = false;
      const unitType: UnitOfMeasurementType = 'percentage';
      const result = valueToString(value, showPercentage, unitType);
      const expectedResult = '0.01';
      expect(result).toEqual(expectedResult);
    });

    it('should return a string value if unit type is not percentage and percentages are not shown', () => {
      const value: number = 1;
      const showPercentage = false;
      const unitType: UnitOfMeasurementType = 'decimal';
      const result = valueToString(value, showPercentage, unitType);
      const expectedResult = '1';
      expect(result).toEqual(expectedResult);
    });
  });
});

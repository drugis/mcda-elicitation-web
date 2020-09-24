import {getStringForValue} from './ValueCellService';

describe('ValueCellService', () => {
  describe('getStringForvalue', () => {
    it('should return a string version of the input with 3 significant digits', () => {
      const usePercentage = false;
      const result = getStringForValue(1.33742, usePercentage);
      expect(result).toBe('1.337');
    });

    it('should return a percentified string version of the input with 3 significant digits', () => {
      const usePercentage = true;
      const result = getStringForValue(1.33742, usePercentage);
      expect(result).toBe('133.7%');
    });
  });
});

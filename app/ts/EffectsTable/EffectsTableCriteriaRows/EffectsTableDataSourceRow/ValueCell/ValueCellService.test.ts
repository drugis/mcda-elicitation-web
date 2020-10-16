import {getStringForInputValue} from './ValueCellService';

describe('ValueCellService', () => {
  describe('getStringForvalue', () => {
    it('should return a string version of the input with 3 significant digits', () => {
      const usePercentage = false;
      const result = getStringForInputValue(1.33742, usePercentage);
      expect(result).toBe('1.337');
    });

    it('should return a percentified string version of the input with 3 significant digits', () => {
      const usePercentage = true;
      const result = getStringForInputValue(1.33742, usePercentage);
      expect(result).toBe('133.7');
    });
  });
});

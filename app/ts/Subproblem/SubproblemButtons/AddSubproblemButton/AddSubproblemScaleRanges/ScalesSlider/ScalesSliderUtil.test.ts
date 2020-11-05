import {calculateRestrictedAreaRatio} from './ScalesSliderUtil';

describe('scalesSliderUtil', () => {
  describe('calculateRestrictedAreaRatio', () => {
    it('should return a string of ratio of restricted and total slider area', () => {
      const sliderRange: [number, number] = [0, 1];
      const configuredRange: [number, number] = [0.25, 0.75];
      const result = calculateRestrictedAreaRatio(sliderRange, configuredRange);
      const expectedResult = '50%';
      expect(result).toEqual(expectedResult);
    });
  });
});

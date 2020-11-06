import {calculateRestrictedAreaWidthPercentage} from './ScalesSliderUtil';

describe('scalesSliderUtil', () => {
  describe('calculateRestrictedAreaWidthPercentage', () => {
    it('should return a string the percentage of restricted area compared to the total slider', () => {
      const sliderRange: [number, number] = [0, 1];
      const configuredRange: [number, number] = [0.25, 0.75];
      const result = calculateRestrictedAreaWidthPercentage(
        sliderRange,
        configuredRange
      );
      const expectedResult = '50%';
      expect(result).toEqual(expectedResult);
    });
  });
});

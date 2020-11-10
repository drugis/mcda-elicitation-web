import {
  adjustConfiguredRangeForStepSize,
  determineStepSizes
} from './AddSubproblemScaleRangesUtil';

describe('addSubproblemScaleRangesUtil', () => {
  describe('adjustConfiguredRangeForStepSize', () => {
    it('should return rounded configured ranges', () => {
      const stepSize = 0.1;
      const configuredRange: [number, number] = [1.04, 1.41];
      const result = adjustConfiguredRangeForStepSize(
        stepSize,
        configuredRange
      );
      const expectedResult: [number, number] = [1, 1.5];
      expect(result).toEqual(expectedResult);
    });

    it('should return original configured ranges', () => {
      const stepSize = 0.1;
      const configuredRange: [number, number] = [1, 1.4];
      const result = adjustConfiguredRangeForStepSize(
        stepSize,
        configuredRange
      );
      expect(result).toEqual(result);
    });
  });

  describe('determineStepSizes', () => {
    it('should return the correct step sizes', () => {
      const lowestObservedValue = 0;
      const highestObservedValue = 0.9;
      const result = determineStepSizes(
        lowestObservedValue,
        highestObservedValue
      );
      const expectedResult = [0.1, 0.01, 0.001];
      expect(result).toEqual(expectedResult);
    });
  });
});

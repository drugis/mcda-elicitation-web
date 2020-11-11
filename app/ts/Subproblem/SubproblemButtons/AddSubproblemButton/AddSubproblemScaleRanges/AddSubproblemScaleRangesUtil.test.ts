import {adjustConfiguredRangeForStepSize} from './AddSubproblemScaleRangesUtil';

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
});

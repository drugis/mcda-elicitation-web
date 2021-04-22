import {Mark} from '@material-ui/core';
import IDataSource from '@shared/interface/IDataSource';
import {
  adjustConfiguredRangeForStepSize,
  createMarks,
  decreaseSliderLowerBound,
  getCeil,
  getFloor,
  getSliderLimits,
  getStepSizeAdjustedConfiguredRanges,
  increaseSliderUpperBound
} from './AddSubproblemScaleRangesUtil';

describe('addSubproblemScaleRangesUtil', () => {
  describe('getStepSizeAdjustedConfiguredRanges', () => {
    it('should return configured ranges adjusted for step size', () => {
      const dataSources: Record<string, IDataSource> = {
        ds1Id: {id: 'ds1Id'} as IDataSource
      };
      const stepSizes = {ds1Id: 10};
      const configuredRanges = {ds1Id: [-1, 55] as [number, number]};
      const result = getStepSizeAdjustedConfiguredRanges(
        dataSources,
        stepSizes,
        configuredRanges
      );
      const expectedResult = {ds1Id: [0, 55]};
      expect(result).toEqual(expectedResult);
    });
  });

  describe('adjustConfiguredRangeForStepSize', () => {
    it('should return rounded configured ranges', () => {
      const stepSize = 0.1;
      const configuredRange: [number, number] = [1.04, 1.41];
      const sliderRange: [number, number] = [0, 2];
      const result = adjustConfiguredRangeForStepSize(
        stepSize,
        configuredRange,
        sliderRange
      );
      const expectedResult: [number, number] = [1, 1.5];
      expect(result).toEqual(expectedResult);
    });

    it('should return original configured ranges', () => {
      const stepSize = 0.1;
      const configuredRange: [number, number] = [1, 1.4];
      const sliderRange: [number, number] = [0, 2];
      const result = adjustConfiguredRangeForStepSize(
        stepSize,
        configuredRange,
        sliderRange
      );
      expect(result).toEqual(result);
    });

    it('should return slider range', () => {
      const stepSize = 0.1;
      const configuredRange: [number, number] = [1.04, 1.4];
      const sliderRange: [number, number] = [1.1, 1.4];
      const result = adjustConfiguredRangeForStepSize(
        stepSize,
        configuredRange,
        sliderRange
      );
      expect(result).toEqual(sliderRange);
    });
  });

  describe('createMarks', () => {
    it('should return four marks with percentified labels', () => {
      const sliderRange: [number, number] = [0.1, 1];
      const observedRange: [number, number] = [0.2, 0.8];
      const usePercentage = true;
      const result = createMarks(sliderRange, observedRange, usePercentage);
      const expectedResult: Mark[] = [
        {value: 0.1, label: 10},
        {value: 0.2},
        {value: 0.8},
        {value: 1, label: 100}
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return four marks with non-percentified labels', () => {
      const sliderRange: [number, number] = [0.1, 1];
      const observedRange: [number, number] = [0.2, 0.8];
      const usePercentage = false;
      const result = createMarks(sliderRange, observedRange, usePercentage);
      const expectedResult: Mark[] = [
        {value: 0.1, label: 0.1},
        {value: 0.2},
        {value: 0.8},
        {value: 1, label: 1}
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return two marks', () => {
      const sliderRange: [number, number] = [0.1, 1];
      const observedRange: [number, number] = [0.1, 1];
      const usePercentage = false;
      const result = createMarks(sliderRange, observedRange, usePercentage);
      const expectedResult: Mark[] = [
        {value: 0.1, label: 0.1},
        {value: 1, label: 1}
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSliderLimits', () => {
    it('should return the configured range as the slider limits', () => {
      const observedRange: [number, number] = [0.4, 0.6];
      const configuredRange: [number, number] = [0, 1];
      const result = getSliderLimits(observedRange, configuredRange);
      const expectedResult: [number, number] = [0, 1];
      expect(result).toEqual(expectedResult);
    });

    it('should return an adjusted configured range as the slider limits', () => {
      const observedRange: [number, number] = [1, 1];
      const configuredRange: [number, number] = [1, 1];
      const result = getSliderLimits(observedRange, configuredRange);
      const expectedResult: [number, number] = [0.9, 2];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFloor', () => {
    it('should return a rounded down configured value', () => {
      const configuredLower = 0.012;
      const restrictedLower = 0.2;
      const result = getFloor(configuredLower, restrictedLower);
      expect(result).toEqual(0.01);
    });

    it('should return a rounded down restricted value', () => {
      const configuredLower = 0.22;
      const restrictedLower = 0.21;
      const result = getFloor(configuredLower, restrictedLower);
      expect(result).toEqual(0.2);
    });
  });

  describe('decreaseSliderLowerBound', () => {
    it('should return slider limits with decreased lower bound', () => {
      const configuredRange: [number, number] = [0.2, 0.3];
      const theoreticalLower = 0;
      const result = decreaseSliderLowerBound(
        configuredRange,
        theoreticalLower
      );
      const expectedResult: [number, number] = [0.1, 0.3];
      expect(result).toEqual(expectedResult);
    });

    it('should return slider limits with the theretical lowest value', () => {
      const configuredRange: [number, number] = [0.2, 1];
      const theoreticalLower = 0;
      const result = decreaseSliderLowerBound(
        configuredRange,
        theoreticalLower
      );
      const expectedResult: [number, number] = [0, 1];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('increaseSliderUpperBound', () => {
    it('should return slider limits with increased upper bound', () => {
      const configuredRange: [number, number] = [0.2, 0.3];
      const theoreticalUpper = 1;
      const result = increaseSliderUpperBound(
        configuredRange,
        theoreticalUpper
      );
      const expectedResult: [number, number] = [0.2, 0.4];
      expect(result).toEqual(expectedResult);
    });

    it('should return slider limits with the theretical highest value', () => {
      const configuredRange: [number, number] = [0.2, 0.9];
      const theoreticalUpper = 1;
      const result = increaseSliderUpperBound(
        configuredRange,
        theoreticalUpper
      );
      const expectedResult: [number, number] = [0.2, 1];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCeil', () => {
    it('should return a rounded up configured value', () => {
      const configuredUpper = 0.2;
      const restrictedUpper = 0.1;
      const result = getCeil(configuredUpper, restrictedUpper);
      expect(result).toEqual(0.2);
    });

    it('should return a rounded up restricted value', () => {
      const configuredUpper = 0.21;
      const restrictedUpper = 0.22;
      const result = getCeil(configuredUpper, restrictedUpper);
      expect(result).toEqual(0.3);
    });
  });
});

import {TPvf} from '@shared/interface/Problem/IPvf';
import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import {
  getEquivalentRangeValue,
  getEquivalentValue,
  getInitialReferenceValueFrom,
  getInitialReferenceValueTo,
  getPartOfInterval
} from './equivalentChangeUtil';

describe('equivalentChangeUtil', () => {
  describe('getPartOfInterval', () => {
    it('should calculate the ratio of the chosen interval to the total range for a favourable criterion', () => {
      const from = 0;
      const to = 0.5;
      const lowerBound = 0;
      const upperBound = 1;
      const result = getPartOfInterval(from, to, lowerBound, upperBound);
      expect(result).toEqual(0.5);
    });

    it('should calculate the ratio of the chosen interval to the total range for an unfavourable criterion', () => {
      const from = 0.5;
      const to = 0;
      const lowerBound = 0;
      const upperBound = 1;
      const result = getPartOfInterval(from, to, lowerBound, upperBound);
      expect(result).toEqual(0.5);
    });
  });

  describe('getInitialReferenceValueFrom', () => {
    it('should return an inital value at 45% of the interval for an increasing pvf', () => {
      const pvf: ILinearPvf = {
        range: [0, 1],
        direction: 'increasing',
        type: 'linear'
      };
      const result = getInitialReferenceValueFrom(0, 1, pvf);
      expect(result).toEqual(0.45);
    });

    it('should return an inital value at 55% of the interval for a decreasing pvf', () => {
      const pvf: ILinearPvf = {
        range: [0, 1],
        direction: 'decreasing',
        type: 'linear'
      };
      const result = getInitialReferenceValueFrom(0, 1, pvf);
      expect(result).toEqual(0.55);
    });
  });

  describe('getInitialReferenceValueTo', () => {
    it('should return an inital value at 55% of the interval for an increasing pvf', () => {
      const pvf: ILinearPvf = {
        range: [0, 1],
        direction: 'increasing',
        type: 'linear'
      };
      const result = getInitialReferenceValueTo(0, 1, pvf);
      expect(result).toEqual(0.55);
    });

    it('should return an inital value at 45% of the interval for a decreasing pvf', () => {
      const pvf: ILinearPvf = {
        range: [0, 1],
        direction: 'decreasing',
        type: 'linear'
      };
      const result = getInitialReferenceValueTo(0, 1, pvf);
      expect(result).toEqual(0.45);
    });
  });

  const usePercentage = false;
  const criterionWeight = 0.1;
  const partOfInterval = 0.5;
  const referenceWeight = 0.4;
  describe('getEquivalentRangeValue', () => {
    it('should return an improved value given a worst value, considering the weights, and ratio to the reference criterion, for an increasing pvf', () => {
      const pvf = {range: [0, 1], direction: 'increasing'} as TPvf;
      const result = getEquivalentRangeValue(
        usePercentage,
        criterionWeight,
        pvf,
        partOfInterval,
        referenceWeight
      );
      expect(result).toEqual(2);
    });

    it('should return an improved value given a worst value, considering the weights, and ratio to the reference criterion, for a decreasing pvf', () => {
      const pvf = {range: [0, 1], direction: 'decreasing'} as TPvf;
      const result = getEquivalentRangeValue(
        usePercentage,
        criterionWeight,
        pvf,
        partOfInterval,
        referenceWeight
      );
      expect(result).toEqual(-1);
    });
  });

  describe('getEquivalentValue', () => {
    it('should return the equivalent change for a second criterion, based on its pvf, a reference change and the relative weights of the criteria, for increasing pvf', () => {
      const pvf = {range: [0, 1], direction: 'increasing'} as TPvf;
      const result = getEquivalentValue(
        usePercentage,
        criterionWeight, // 0.1
        pvf,
        partOfInterval, // 0.5
        referenceWeight // 0.4
      );
      expect(result).toEqual(2);
    });
    it('should return the equivalent change for a second criterion, based on its pvf, a reference change and the relative weights of the criteria, for decreasing pvf', () => {
      const pvf = {range: [0, 1], direction: 'decreasing'} as TPvf;
      const result = getEquivalentValue(
        usePercentage,
        criterionWeight, // 0.1
        pvf,
        partOfInterval, // 0.5
        referenceWeight // 0.4
      );
      expect(result).toEqual(-2);
    });
  });
});

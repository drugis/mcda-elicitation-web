import IPvf from '@shared/interface/Problem/IPvf';
import {
  getInitialReferenceValueFrom,
  getInitialReferenceValueTo,
  getPartOfInterval
} from './tradeOffUtil';

describe('tradeOffUtil', () => {
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
      const pvf: IPvf = {
        range: [0, 1],
        direction: 'increasing',
        type: 'linear'
      };
      const result = getInitialReferenceValueFrom(0, 1, pvf);
      expect(result).toEqual(0.45);
    });

    it('should return an inital value at 55% of the interval for a decreasing pvf', () => {
      const pvf: IPvf = {
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
      const pvf: IPvf = {
        range: [0, 1],
        direction: 'increasing',
        type: 'linear'
      };
      const result = getInitialReferenceValueTo(0, 1, pvf);
      expect(result).toEqual(0.55);
    });

    it('should return an inital value at 45% of the interval for a decreasing pvf', () => {
      const pvf: IPvf = {
        range: [0, 1],
        direction: 'decreasing',
        type: 'linear'
      };
      const result = getInitialReferenceValueTo(0, 1, pvf);
      expect(result).toEqual(0.45);
    });
  });
});

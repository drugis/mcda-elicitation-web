import {
  getInitialReferenceValueFrom,
  getInitialReferenceValueTo,
  getPartOfInterval
} from './tradeOffUtil';

describe('tradeOffUtil', () => {
  describe('getPartOfInterval', () => {
    it('should calculate the ratio of the chosen interval to the total range', () => {
      const from = 0;
      const to = 0.5;
      const lowerBound = 0;
      const upperBound = 1;
      const result = getPartOfInterval(from, to, lowerBound, upperBound);
      expect(result).toEqual(0.5);
    });
  });

  describe('getInitialReferenceValueFrom', () => {
    it('should return an inital value at 45% of the interval', () => {
      const result = getInitialReferenceValueFrom(0, 1);
      expect(result).toEqual(0.45);
    });
  });

  describe('getInitialReferenceValueTo', () => {
    it('should return an inital value at 55% of the interval', () => {
      const result = getInitialReferenceValueTo(0, 1);
      expect(result).toEqual(0.55);
    });
  });
});

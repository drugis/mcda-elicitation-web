import {
  buildImportance,
  calculateRankings
} from './PreferencesWeightsTableUtil';

describe('buildImportance', () => {
  it('should return all-100% if there are equal weights', () => {
    const weights: Record<string, number> = {
      critId1: 0.33,
      critId2: 0.33,
      critId3: 0.33
    };

    const result = buildImportance(weights);
    const expectedResult = {
      critId1: '100%',
      critId2: '100%',
      critId3: '100%'
    };

    expect(result).toEqual(expectedResult);
  });

  it('should return correct importances for exact swing preferences', () => {
    const weights: Record<string, number> = {
      critId1: 0.3,
      critId2: 0.1,
      critId3: 0.6
    };

    const result = buildImportance(weights);
    const expectedResult: Record<string, string> = {
      critId1: '50%',
      critId2: '17%',
      critId3: '100%'
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('calculateRankings', () => {
  it('should work for all-different weights', () => {
    const weights: Record<string, number> = {
      critId1: 0.2,
      critId2: 0.1,
      critId3: 0.7
    };

    const result = calculateRankings(weights);
    const expectedResult = {
      critId1: 2,
      critId2: 3,
      critId3: 1
    };

    expect(result).toEqual(expectedResult);
  });
  it('should work for all-same weights', () => {
    const weights: Record<string, number> = {
      critId1: 0.33,
      critId2: 0.33,
      critId3: 0.33
    };

    const result = calculateRankings(weights);
    const expectedResult = {
      critId1: 1,
      critId2: 1,
      critId3: 1
    };

    expect(result).toEqual(expectedResult);
  });
  it('should work for some-same weights', () => {
    const weights: Record<string, number> = {
      critId1: 0.4,
      critId2: 0.4,
      critId3: 0.1,
      critId4: 0.1,
      critId5: 0.01
    };

    const result = calculateRankings(weights);
    const expectedResult = {
      critId1: 1,
      critId2: 1,
      critId3: 3,
      critId4: 3,
      critId5: 5
    };

    expect(result).toEqual(expectedResult);
  });
});

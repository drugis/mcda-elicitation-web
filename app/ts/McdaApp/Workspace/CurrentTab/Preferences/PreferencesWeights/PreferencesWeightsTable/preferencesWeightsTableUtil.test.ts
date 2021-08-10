import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {
  buildImportances,
  calculateNewImportances,
  calculateRankings
} from './preferencesWeightsTableUtil';

describe('preferencesWeightsTableUtil', () => {
  describe('buildImportances', () => {
    it('should return the importances based on the weights with the highest as 100%', () => {
      const weights = {crit1: 0.2, crit2: 0.4, crit3: 0.1, crit4: 0.3};
      const result = buildImportances(weights);
      const expectedResult = {crit1: 50, crit2: 100, crit3: 25, crit4: 75};
      expect(result).toEqual(expectedResult);
    });
  });

  describe('calculateRankings', () => {
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
  });

  describe('calculateNewImportances', () => {
    it('should return non-normalized new importances based on new equivalent change values if none of the new importances exceeds 100', () => {
      const equivalentChanges: Record<string, IChangeableValue> = {
        crit1: {currentValue: 0.5, originalValue: 1}
      };
      const importances: Record<string, IChangeableValue> = {
        crit1: {currentValue: 50, originalValue: 50}
      };
      const result: Record<string, IChangeableValue> = calculateNewImportances(
        equivalentChanges,
        importances
      );
      const expectedResult: Record<string, IChangeableValue> = {
        crit1: {currentValue: 100, originalValue: 50}
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return normalized new importances based on new equivalent change values if one of the new importances exceeds 100', () => {
      const equivalentChanges: Record<string, IChangeableValue> = {
        crit1: {currentValue: 0.5, originalValue: 1},
        crit2: {currentValue: 1, originalValue: 1}
      };
      const importances: Record<string, IChangeableValue> = {
        crit1: {currentValue: 100, originalValue: 100},
        crit2: {currentValue: 50, originalValue: 50}
      };
      const result: Record<string, IChangeableValue> = calculateNewImportances(
        equivalentChanges,
        importances
      );
      const expectedResult: Record<string, IChangeableValue> = {
        crit1: {currentValue: 100, originalValue: 100},
        crit2: {currentValue: 25, originalValue: 50}
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

import {TPvf} from '@shared/interface/Problem/IPvf';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {
  calculateNewDeterministicEquivalentChanges,
  calculateWeightsFromImportances,
  getDeterministicEquivalentChangeLabel,
  getDeterministicEquivalentChanges,
  getDetermisticImportances
} from './deterministicWeightsUtil';

describe('deterministicWeightsTableUtil', () => {
  describe('getDetermisticImportances', () => {
    it('return the weights transformed into changeable values ', () => {
      const weights: Record<string, number> = {crit1: 100, crit2: 37};
      const result = getDetermisticImportances(weights);
      const expectedResult: Record<string, IChangeableValue> = {
        crit1: {originalValue: 100, currentValue: 100},
        crit2: {currentValue: 37, originalValue: 37}
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDeterministicEquivalentChanges', () => {
    it('should return the equivalent changes for each criterion', () => {
      const weights: Record<string, number> = {crit1: 1};
      const pvfs: Record<string, TPvf> = {
        crit1: {direction: 'increasing', range: [0, 1]} as TPvf
      };
      const partOfInterval = 0.5;
      const referenceWeight = 1;
      const result = getDeterministicEquivalentChanges(
        weights,
        pvfs,
        partOfInterval,
        referenceWeight
      );
      const expectedResult: Record<string, IChangeableValue> = {
        crit1: {originalValue: 0.5, currentValue: 0.5}
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDeterministicEquivalentChangeLabel', () => {
    it('should return just the number if the original and current value are equal', () => {
      const equivalentChange: IChangeableValue = {
        originalValue: 37,
        currentValue: 37
      };
      const usePercentage = false;
      expect(
        getDeterministicEquivalentChangeLabel(equivalentChange, usePercentage)
      ).toEqual('37');
    });

    it('should return "newValue (oldValue)" if the original and current value are different', () => {
      const equivalentChange: IChangeableValue = {
        originalValue: 42,
        currentValue: 37
      };
      const usePercentage = false;
      expect(
        getDeterministicEquivalentChangeLabel(equivalentChange, usePercentage)
      ).toEqual('37 (42)');
    });

    it('should return a percentified label for decimals with usePercentage being true', () => {
      const equivalentChange: IChangeableValue = {
        originalValue: 0.42,
        currentValue: 0.37
      };
      const usePercentage = true;
      expect(
        getDeterministicEquivalentChangeLabel(equivalentChange, usePercentage)
      ).toEqual('37 (42)');
    });

    it('should ignore very small differences', () => {
      const equivalentChange: IChangeableValue = {
        originalValue: 37,
        currentValue: 37.00000001
      };
      const usePercentage = false;
      expect(
        getDeterministicEquivalentChangeLabel(equivalentChange, usePercentage)
      ).toEqual('37');
    });

    it('should ignore very small differences', () => {
      const equivalentChange: IChangeableValue = {
        originalValue: 37,
        currentValue: 36.999999
      };
      const usePercentage = false;
      expect(
        getDeterministicEquivalentChangeLabel(equivalentChange, usePercentage)
      ).toEqual('37');
    });
  });

  describe('calculateNewDeterministicEquivalentChanges', () => {
    it('should return equivalent changes based on importances', () => {
      const importances: Record<string, IChangeableValue> = {
        crit1: {currentValue: 50, originalValue: 100}
      };
      const equivalentChanges: Record<string, IChangeableValue> = {
        crit1: {currentValue: 10, originalValue: 10}
      };
      const result = calculateNewDeterministicEquivalentChanges(
        importances,
        equivalentChanges
      );
      const expectedResult: Record<string, IChangeableValue> = {
        crit1: {currentValue: 20, originalValue: 10}
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('calculateWeightsFromImportances', () => {
    it('should return weights based importances', () => {
      const importances: Record<string, IChangeableValue> = {
        crit1: {currentValue: 100, originalValue: 100},
        crit2: {currentValue: 50, originalValue: 100},
        crit3: {currentValue: 50, originalValue: 100}
      };

      const result = calculateWeightsFromImportances(importances);
      const expectedResult: Record<string, number> = {
        crit1: 0.5,
        crit2: 0.25,
        crit3: 0.25
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

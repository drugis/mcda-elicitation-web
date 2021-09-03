import ICriterion from '@shared/interface/ICriterion';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {TPvf} from '@shared/interface/Problem/IPvf';
import IEquivalentChange from '@shared/interface/Scenario/IEquivalentChange';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IScenarioState from '@shared/interface/Scenario/IScenarioState';
import {TPreferences} from '@shared/types/preferences';
import {
  getEquivalentChange,
  getEquivalentChangeByThreshold,
  getEquivalentChangeValue,
  getPartOfInterval,
  getTheoreticalRange
} from './equivalentChangeUtil';

describe('equivalentChangeUtil', () => {
  describe('getPartOfInterval', () => {
    it('should calculate the ratio of the chosen value to the total range', () => {
      const lowerBound = 0;
      const upperBound = 5;
      const result = getPartOfInterval(2.5, [lowerBound, upperBound]);
      expect(result).toEqual(0.5);
    });
  });

  const criterionWeight = 0.1;
  const partOfInterval = 0.5;
  const referenceWeight = 0.4;

  describe('getEquivalentChangeValue', () => {
    it('should return the equivalent change for a second criterion, based on its pvf, a reference change and the relative weights of the criteria, for increasing pvf', () => {
      const pvf = {range: [0, 1], direction: 'increasing'} as TPvf;
      const result = getEquivalentChangeValue(
        criterionWeight, // 0.1
        pvf,
        partOfInterval, // 0.5
        referenceWeight // 0.4
      );
      expect(result).toEqual(2);
    });

    it('should return the equivalent change for a second criterion, based on its pvf, a reference change and the relative weights of the criteria, for decreasing pvf', () => {
      const pvf = {range: [0, 1], direction: 'decreasing'} as TPvf;
      const result = getEquivalentChangeValue(
        criterionWeight, // 0.1
        pvf,
        partOfInterval, // 0.5
        referenceWeight // 0.4
      );
      expect(result).toEqual(2);
    });
  });

  describe('getTheoreticalRange', () => {
    it('should return [-Infinity, Infinity] if the bounds are null', () => {
      const unit = {lowerBound: null, upperBound: null} as IUnitOfMeasurement;
      const usePercentage = false;
      const result = getTheoreticalRange(unit, usePercentage);
      const expectedResult = [-Infinity, Infinity];
      expect(result).toEqual(expectedResult);
    });

    it('should return [0,1] if usePercentage is false for a decimal unit', () => {
      const unit = {
        lowerBound: 0,
        upperBound: 1,
        type: 'decimal'
      } as IUnitOfMeasurement;
      const usePercentage = false;
      const result = getTheoreticalRange(unit, usePercentage);
      const expectedResult = [0, 1];
      expect(result).toEqual(expectedResult);
    });

    it('should return [0,1] if usePercentage is false for a percentage unit', () => {
      const unit = {
        lowerBound: 0,
        upperBound: 100,
        type: 'percentage'
      } as IUnitOfMeasurement;
      const usePercentage = false;
      const result = getTheoreticalRange(unit, usePercentage);
      const expectedResult = [0, 1];
      expect(result).toEqual(expectedResult);
    });

    it('should return [0,100] if usePercentage is true for a decimal unit', () => {
      const unit = {
        lowerBound: 0,
        upperBound: 1,
        type: 'decimal'
      } as IUnitOfMeasurement;
      const usePercentage = true;
      const result = getTheoreticalRange(unit, usePercentage);
      const expectedResult = [0, 100];
      expect(result).toEqual(expectedResult);
    });

    it('should return [0,100] if usePercentage is true for a percentage unit', () => {
      const unit = {
        lowerBound: 0,
        upperBound: 100,
        type: 'percentage'
      } as IUnitOfMeasurement;
      const usePercentage = true;
      const result = getTheoreticalRange(unit, usePercentage);
      const expectedResult = [0, 100];
      expect(result).toEqual(expectedResult);
    });

    it('should return the bounds otherwise', () => {
      const unit = {
        lowerBound: 37,
        upperBound: 42,
        type: 'custom'
      } as IUnitOfMeasurement;
      const usePercentage = true;
      const result = getTheoreticalRange(unit, usePercentage);
      const expectedResult = [37, 42];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getEquivalentChange', () => {
    const referenceCriterion = {
      id: 'crit1'
    } as ICriterion;
    const bounds: [number, number] = [0, 1];

    it('should calculate default values for equivalent change', () => {
      const result = getEquivalentChange(referenceCriterion, bounds);
      const expectedResult: IEquivalentChange = {
        referenceCriterionId: 'crit1',
        by: 0.5,
        partOfInterval: 0.5
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getEquivalentChangeByThreshold', () => {
    it('should return equivalent change initialized using threshold values', () => {
      const thresholdValuesByCriterion: Record<string, number> = {
        refId: 1,
        notRefId: 15
      };
      const prefs: TPreferences = [
        {criteria: ['refId', 'notRefId']} as IExactSwingRatio
      ];
      const state = {
        thresholdValuesByCriterion,
        prefs
      } as IScenarioState;
      const scenario = {state} as IMcdaScenario;
      const bounds: [number, number] = [5, 15];
      const result = getEquivalentChangeByThreshold(scenario, bounds);
      const expectedResult: IEquivalentChange = {
        by: 1,
        partOfInterval: 0.1,
        referenceCriterionId: 'refId'
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

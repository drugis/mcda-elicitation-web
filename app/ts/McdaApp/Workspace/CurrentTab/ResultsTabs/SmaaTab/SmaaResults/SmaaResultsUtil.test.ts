import IAlternative from '@shared/interface/IAlternative';
import IBetaDistribution from '@shared/interface/IBetaDistribution';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import ITextEffect from '@shared/interface/ITextEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {TPreferences} from '@shared/types/preferences';
import {Primitive} from 'c3';
import {
  getCentralWeightsPlotData,
  getRankPlotData,
  getSmaaWarnings,
  hasStochasticMeasurements,
  hasStochasticWeights
} from './SmaaResultsUtil';

describe('SmaaResultsUtil', () => {
  describe('hasStochasticMeasurements', () => {
    it('should return true if there is atleast one distribution that is not a value, empty, or text distributions', () => {
      const distributions: Distribution[] = [
        {type: 'beta'} as IBetaDistribution,
        {type: 'text'} as ITextEffect,
        {type: 'empty'} as IEmptyEffect,
        {type: 'value'} as IValueEffect
      ];
      expect(hasStochasticMeasurements(distributions)).toBeTruthy();
    });

    it('should return false if there is no distribution that is not value, empty or text', () => {
      const distributions: Distribution[] = [
        {type: 'text'} as ITextEffect,
        {type: 'empty'} as IEmptyEffect,
        {type: 'value'} as IValueEffect
      ];
      expect(hasStochasticMeasurements(distributions)).toBeFalsy();
    });
  });

  describe('hasStochasticWeights', () => {
    it('should return true if there are ordinal weights', () => {
      const preferences: TPreferences = [{type: 'ordinal'} as IRanking];
      expect(hasStochasticWeights(preferences)).toBeTruthy();
    });

    it('should return true if there are ratio bound weights', () => {
      const preferences: TPreferences = [
        {type: 'ratio bound'} as IRatioBoundConstraint
      ];
      expect(hasStochasticWeights(preferences)).toBeTruthy();
    });

    it('should return true if there are no weights', () => {
      const preferences: TPreferences = [];
      expect(hasStochasticWeights(preferences)).toBeTruthy();
    });

    it('should return false if there are constraints, of which none stochastic', () => {
      const preferences: TPreferences = [
        {type: 'exact swing'} as IExactSwingRatio
      ];
      expect(hasStochasticWeights(preferences)).toBeFalsy();
    });
  });

  describe('getSmaaWarnings', () => {
    const DETERMINISTIC_WARNING =
      'SMAA results will be identical to the deterministic results because there are no stochastic inputs';
    const MEASUREMENTS_WARNING = 'Measurements are not stochastic';
    const WEIGHTS_WARNING = 'Weights are not stochastic';

    it('should return a warning if both the measurements and weights uncertainty is turned off', () => {
      const useMeasurementsUncertainty = false;
      const useWeightsUncertainty = false;
      const problemHasStochasticMeasurements = true;
      const problemHasStochasticWeights = true;
      const result = getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      );
      const expectedResult = [DETERMINISTIC_WARNING];
      expect(result).toEqual(expectedResult);
    });

    it('should return a warning if there are no stochastic measurements', () => {
      const useMeasurementsUncertainty = true;
      const useWeightsUncertainty = true;
      const problemHasStochasticMeasurements = false;
      const problemHasStochasticWeights = true;
      const result = getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      );
      const expectedResult = [MEASUREMENTS_WARNING];
      expect(result).toEqual(expectedResult);
    });

    it('should return a warning if there are no stochastic weights', () => {
      const useMeasurementsUncertainty = true;
      const useWeightsUncertainty = true;
      const problemHasStochasticMeasurements = true;
      const problemHasStochasticWeights = false;
      const result = getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      );
      const expectedResult = [WEIGHTS_WARNING];
      expect(result).toEqual(expectedResult);
    });

    it('should return all the warnings', () => {
      const useMeasurementsUncertainty = false;
      const useWeightsUncertainty = false;
      const problemHasStochasticMeasurements = false;
      const problemHasStochasticWeights = false;
      const result = getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      );
      const expectedResult = [
        DETERMINISTIC_WARNING,
        MEASUREMENTS_WARNING,
        WEIGHTS_WARNING
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return no warning if everything is fine', () => {
      const useMeasurementsUncertainty = true;
      const useWeightsUncertainty = true;
      const problemHasStochasticMeasurements = true;
      const problemHasStochasticWeights = true;
      const result = getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      );
      expect(result).toEqual([]);
    });

    it('should return no warning if there is stochasticity in the measurements', () => {
      const useMeasurementsUncertainty = true;
      const useWeightsUncertainty = false;
      const problemHasStochasticMeasurements = true;
      const problemHasStochasticWeights = true;
      const result = getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      );
      expect(result).toEqual([]);
    });

    it('should return no warning if there is stochasticity in the weights', () => {
      const useMeasurementsUncertainty = false;
      const useWeightsUncertainty = true;
      const problemHasStochasticMeasurements = true;
      const problemHasStochasticWeights = true;
      const result = getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      );
      expect(result).toEqual([]);
    });
  });

  describe('getRankPlotData', () => {
    it('should format the ranking data for the plot', () => {
      const legend: Record<string, string> = undefined;
      const ranks: Record<string, number[]> = {alt1: [0, 42], alt2: [1, 37]};
      const alternatives: IAlternative[] = [
        {id: 'alt1', title: 'alternative1'},
        {id: 'alt2', title: 'alternative2'}
      ];
      const result = getRankPlotData(ranks, alternatives, legend);
      const expectedResult: [string, ...Primitive[]][] = [
        ['x', 'alternative1', 'alternative2'],
        ['Rank 1', 0, 42],
        ['Rank 2', 1, 37]
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should format the ranking data for the plot, replacing titles using the legend', () => {
      const legend: Record<string, string> = {
        alt1: 'Final',
        alt2: 'Smasher'
      };
      const ranks: Record<string, number[]> = {alt1: [0, 42], alt2: [1, 37]};
      const alternatives: IAlternative[] = [
        {id: 'alt1', title: 'alternative1'},
        {id: 'alt2', title: 'alternative2'}
      ];
      const result = getRankPlotData(ranks, alternatives, legend);
      const expectedResult: [string, ...Primitive[]][] = [
        ['x', 'Final', 'Smasher'],
        ['Rank 1', 0, 42],
        ['Rank 2', 1, 37]
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCentralWeightsPlotData', () => {
    it('should format the central weights data for the plot', () => {
      const legend: Record<string, string> = undefined;
      const centralWeights: Record<string, ICentralWeight> = {
        alt1: {cf: 13, w: {crit1: 1, crit2: 2}},
        alt2: {cf: 37, w: {crit1: 3, crit2: 4}}
      };
      const alternatives: IAlternative[] = [
        {id: 'alt1', title: 'alternative1'},
        {id: 'alt2', title: 'alternative2'}
      ];
      const criteria: ICriterion[] = [
        {
          id: 'crit1',
          title: 'criterion1',
          dataSources: [{id: 'ds1Id'}]
        } as ICriterion,
        {
          id: 'crit2',
          title: 'criterion2',
          dataSources: [{id: 'ds2Id'}]
        } as ICriterion
      ];
      const result = getCentralWeightsPlotData(
        centralWeights,
        criteria,
        alternatives,
        legend
      );
      const expectedResult: [string, ...Primitive[]][] = [
        ['x', 'criterion1', 'criterion2'],
        ['alternative1', 1, 2],
        ['alternative2', 3, 4]
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should format the ranking data for the plot, replacing titles using the legend', () => {
      const legend: Record<string, string> = {
        alt1: 'Final',
        alt2: 'Smasher'
      };
      const centralWeights: Record<string, ICentralWeight> = {
        alt1: {cf: 13, w: {crit1: 1, crit2: 2}},
        alt2: {cf: 37, w: {crit1: 3, crit2: 4}}
      };
      const alternatives: IAlternative[] = [
        {id: 'alt1', title: 'alternative1'},
        {id: 'alt2', title: 'alternative2'}
      ];
      const criteria: ICriterion[] = [
        {
          id: 'crit1',
          title: 'criterion1',
          dataSources: [{id: 'ds1Id'}]
        } as ICriterion,
        {
          id: 'crit2',
          title: 'criterion2',
          dataSources: [{id: 'ds2Id'}]
        } as ICriterion
      ];
      const result = getCentralWeightsPlotData(
        centralWeights,
        criteria,
        alternatives,
        legend
      );
      const expectedResult: [string, ...Primitive[]][] = [
        ['x', 'criterion1', 'criterion2'],
        ['Final', 1, 2],
        ['Smasher', 3, 4]
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});

import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import IWorkspace from '@shared/interface/IWorkspace';
import {
  calculateObservedRanges,
  getConfiguredRangeLabel,
  getRangeLabel,
  getTheoreticalRangeLabel
} from './ScalesTableUtil';

describe('ScalesTableUtil', () => {
  describe('calculateObservedRanges', () => {
    it('should return observed ranges keyed by data source ids', () => {
      const scales: Record<string, Record<string, IScale>> = {
        dataSourceNoDistributionId: {
          alt1Id: {
            '2.5%': 0.1,
            '50%': 0.1,
            '97.5%': 0.1,
            mode: 0.1
          },
          alt2Id: {
            '2.5%': 0.9,
            '50%': 0.9,
            '97.5%': 0.9,
            mode: 0.9
          }
        },
        dataSourceRangeAndExactId: {
          alt1Id: {
            '2.5%': 0.1,
            '50%': 0.25,
            '97.5%': 0.4,
            mode: 0.25
          },
          alt2Id: {
            '2.5%': 0.6,
            '50%': 0.75,
            '97.5%': 0.9,
            mode: 0.75
          }
        },
        dataSourceOverlappingRanges: {
          alt1Id: {
            '2.5%': 0.41,
            '50%': 0.45,
            '97.5%': 0.49,
            mode: 0.45
          },
          alt2Id: {
            '2.5%': 0.91,
            '50%': 0.95,
            '97.5%': 0.99,
            mode: 0.95
          }
        }
      };
      const criteria: ICriterion[] = [
        {
          dataSources: [
            {
              id: 'dataSourceNoDistributionId',
              unitOfMeasurement: {type: 'custom'}
            } as IDataSource
          ]
        } as ICriterion,
        {
          dataSources: [
            {
              id: 'dataSourceRangeAndExactId',
              unitOfMeasurement: {type: 'custom'}
            } as IDataSource
          ]
        } as ICriterion,
        {
          dataSources: [
            {
              id: 'dataSourceOverlappingRanges',
              unitOfMeasurement: {type: 'custom'}
            } as IDataSource
          ]
        } as ICriterion
      ];

      const effects: Effect[] = [
        {
          type: 'empty',
          dataSourceId: 'dataSourceNoDistributionId'
        } as Effect,
        {
          type: 'value',
          dataSourceId: 'dataSourceNoDistributionId',
          value: 0.1
        } as Effect,
        {
          type: 'range',
          dataSourceId: 'dataSourceRangeAndExactId',
          lowerBound: 0,
          upperBound: 0.5
        } as Effect,
        {
          type: 'range',
          dataSourceId: 'dataSourceOverlappingRanges',
          lowerBound: 0.4,
          upperBound: 0.5
        } as Effect
      ];

      const distributions: Distribution[] = [
        {
          type: 'value',
          value: 0.25,
          dataSourceId: 'dataSourceRangeAndExactId'
        } as Distribution,
        {
          type: 'value',
          value: 0.25,
          dataSourceId: 'dataSourceRangeAndExactId'
        } as Distribution,
        {
          type: 'range',
          dataSourceId: 'dataSourceOverlappingRanges',
          lowerBound: 0.9,
          upperBound: 1
        } as Distribution
      ];

      const workspace: IWorkspace = {
        criteria: criteria,
        effects: effects,
        distributions: distributions
      } as IWorkspace;

      const result: Record<string, [number, number]> = calculateObservedRanges(
        scales,
        workspace
      );
      const expectedResult: Record<string, [number, number]> = {
        dataSourceNoDistributionId: [0.1, 0.9],
        dataSourceRangeAndExactId: [0, 0.9],
        dataSourceOverlappingRanges: [0.4, 1]
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getConfiguredRangeLabel', () => {
    const observedRanges: Record<string, [number, number]> = {
      dataSourceNoDistributionId: [37, 42]
    };

    it('should return the configured ranges if available', () => {
      const configuredRanges: Record<string, [number, number]> = {
        dataSourceNoDistributionId: [0, 1]
      };
      const usePercentage = false;
      const result = getConfiguredRangeLabel(
        usePercentage,
        observedRanges['dataSourceNoDistributionId'],
        configuredRanges['dataSourceNoDistributionId']
      );
      const expectedResult = '0, 1';
      expect(result).toEqual(expectedResult);
    });

    it('should return the observed ranges if there are no configured ranges', () => {
      const usePercentage = false;
      const result = getConfiguredRangeLabel(
        usePercentage,
        observedRanges['dataSourceNoDistributionId']
      );
      const expectedResult = '37, 42';
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getRangeLabel', () => {
    it('should return the label for an lower and upper bound', () => {
      const usePercentage = false;
      const observedRange: [number, number] = [37, 42];
      const result = getRangeLabel(usePercentage, observedRange);
      const expectedResult = '37, 42';
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTheoreticalRangeLabel', () => {
    it('should return the label given a theoretical scale in percentages with percentage input', () => {
      const usePercentage = true;
      const unit: IUnitOfMeasurement = {
        lowerBound: 0,
        upperBound: 100,
        type: 'percentage',
        label: '%'
      };
      const result = getTheoreticalRangeLabel(usePercentage, unit);
      const expectedResult = '0, 100';
      expect(result).toEqual(expectedResult);
    });

    it('should return the label given a theoretical scale in decimals with percentage input', () => {
      const usePercentage = false;
      const unit: IUnitOfMeasurement = {
        lowerBound: 0,
        upperBound: 100,
        type: 'percentage',
        label: '%'
      };
      const result = getTheoreticalRangeLabel(usePercentage, unit);
      const expectedResult = '0, 1';
      expect(result).toEqual(expectedResult);
    });

    it('should return the label given a theoretical scale in percentages with decimal input', () => {
      const usePercentage = true;
      const unit: IUnitOfMeasurement = {
        lowerBound: 0,
        upperBound: 1,
        type: 'decimal',
        label: '%'
      };
      const result = getTheoreticalRangeLabel(usePercentage, unit);
      const expectedResult = '0, 100';
      expect(result).toEqual(expectedResult);
    });

    it('should return the label given a theoretical scale in decimals with decimal input', () => {
      const usePercentage = false;
      const unit: IUnitOfMeasurement = {
        lowerBound: 0,
        upperBound: 1,
        type: 'decimal',
        label: '%'
      };
      const result = getTheoreticalRangeLabel(usePercentage, unit);
      const expectedResult = '0, 1';
      expect(result).toEqual(expectedResult);
    });

    it('should return the label given a theoretical scale for a custom unit', () => {
      const usePercentage = false;
      const unit: IUnitOfMeasurement = {
        lowerBound: null,
        upperBound: null,
        type: 'custom',
        label: 'something'
      };
      const result = getTheoreticalRangeLabel(usePercentage, unit);
      const expectedResult = '-∞, ∞';
      expect(result).toEqual(expectedResult);
    });
  });
});

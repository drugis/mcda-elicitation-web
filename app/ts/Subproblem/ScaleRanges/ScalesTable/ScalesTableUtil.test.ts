import IScale from '@shared/interface/IScale';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import {calculateObservedRanges, getConfiguredRange} from './ScalesTableUtil';

describe('ScalesTableUtil', () => {
  describe('calculateObservedRanges', () => {
    it('should return observed ranges keyed by data source ids', () => {
      const scales: Record<string, Record<string, IScale>> = {
        ds1Id: {
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
        ds2Id: {
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
        ds3Id: {
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
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [{id: 'ds1Id'} as IProblemDataSource]
        } as IProblemCriterion,
        crit2Id: {
          dataSources: [{id: 'ds2Id'} as IProblemDataSource]
        } as IProblemCriterion,
        crit3Id: {
          dataSources: [{id: 'ds3Id'} as IProblemDataSource]
        } as IProblemCriterion
      };

      const effectOnly: IPerformanceTableEntry = {
        alternative: 'alt1Id',
        criterion: 'crit1Id',
        dataSource: 'ds1Id',
        performance: {effect: {type: 'exact', value: 0.1}}
      };
      const effectAndExactDistribution: IPerformanceTableEntry = {
        alternative: 'alt2Id',
        criterion: 'crit1Id',
        dataSource: 'ds1Id',
        performance: {
          effect: {type: 'exact', value: 0.9},
          distribution: {type: 'exact', value: 1}
        }
      };
      const rangeDistributionAndEmptyEffect: IPerformanceTableEntry = {
        alternative: 'alt1Id',
        criterion: 'crit2Id',
        dataSource: 'ds2Id',
        performance: {
          effect: {
            type: 'empty'
          },
          distribution: {
            type: 'range',
            parameters: {lowerBound: 0, upperBound: 0.5}
          }
        }
      };
      const rangeDistributionOnly: IPerformanceTableEntry = {
        alternative: 'alt2Id',
        criterion: 'crit2Id',
        dataSource: 'ds2Id',
        performance: {
          distribution: {
            type: 'range',
            parameters: {lowerBound: 0.5, upperBound: 1}
          }
        }
      };
      const exactEffectAndRangeDistribution1: IPerformanceTableEntry = {
        alternative: 'alt1Id',
        criterion: 'crit3Id',
        dataSource: 'ds3Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.1
          },
          distribution: {
            type: 'range',
            parameters: {lowerBound: 0.4, upperBound: 0.5}
          }
        }
      };
      const exactEffectAndRangeDistribution2: IPerformanceTableEntry = {
        alternative: 'alt2Id',
        criterion: 'crit3Id',
        dataSource: 'ds3Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.6
          },
          distribution: {
            type: 'range',
            parameters: {lowerBound: 0.9, upperBound: 1}
          }
        }
      };

      const performanceTable: IPerformanceTableEntry[] = [
        effectOnly,
        effectAndExactDistribution,
        rangeDistributionAndEmptyEffect,
        rangeDistributionOnly,
        exactEffectAndRangeDistribution1,
        exactEffectAndRangeDistribution2
      ];

      const result: Record<string, [number, number]> = calculateObservedRanges(
        scales,
        criteria,
        performanceTable
      );
      const expectedResult: Record<string, [number, number]> = {
        crit1Id: [0.1, 0.9],
        crit2Id: [0, 1],
        crit3Id: [0.1, 1]
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getConfiguredRange', () => {
    const observedRanges: Record<string, [number, number]> = {
      crit1Id: [37, 42]
    };
    const showPercentages = false;

    it('should return the configured ranges if available', () => {
      const configuredRanges: Record<string, [number, number]> = {
        ds1Id: [0, 1]
      };
      const doPercentification = false;
      const result = getConfiguredRange(
        doPercentification,
        observedRanges['crit1Id'],
        configuredRanges['ds1Id']
      );
      const expectedResult = '0, 1';
      expect(result).toEqual(expectedResult);
    });

    it('should return the observed ranges if there are no configured ranges', () => {
      const doPercentification = false;
      const result = getConfiguredRange(
        doPercentification,
        observedRanges['crit1Id']
      );
      const expectedResult = '37, 42';
      expect(result).toEqual(expectedResult);
    });
  });
});

import {IPataviTableEntry} from '@shared/interface/Patavi/IPataviTableEntry';
import {EffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import {TDistributionPerformance} from '@shared/interface/Problem/TDistributionPerformance';
import {buildPataviPerformanceTable} from './PataviUtil';

describe('PataviUtil', () => {
  describe('getPataviProblem', () => {
    it('should', () => fail());
  });

  describe('buildPataviPerformanceTable', () => {
    it('should transform the performance table into a patavi ready version', () => {
      const performanceTable: IPerformanceTableEntry[] = [
        {
          criterion: 'crit1',
          dataSource: 'ds1',
          alternative: 'alt1',
          performance: {
            effect: {type: 'exact'} as EffectPerformance,
            distribution: {type: 'dnorm'} as TDistributionPerformance
          }
        },
        {
          criterion: 'crit2',
          dataSource: 'ds2',
          alternative: 'alt1',
          performance: {
            effect: {type: 'exact'} as EffectPerformance
          }
        },
        {
          criterion: 'crit3',
          dataSource: 'ds3',
          alternative: 'alt1',
          performance: {
            effect: {type: 'exact'} as EffectPerformance,
            distribution: {type: 'empty'} as TDistributionPerformance
          }
        }
      ];
      const result = buildPataviPerformanceTable(performanceTable);
      const expectedResult: IPataviTableEntry[] = [
        {
          criterion: 'crit1',
          dataSource: 'ds1',
          alternative: 'alt1',
          performance: {type: 'dnorm'} as TDistributionPerformance
        },
        {
          criterion: 'crit2',
          dataSource: 'ds2',
          alternative: 'alt1',
          performance: {type: 'exact'} as EffectPerformance
        },
        {
          criterion: 'crit3',
          dataSource: 'ds3',
          alternative: 'alt1',
          performance: {type: 'exact'} as EffectPerformance
        }
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if there is an invalid performance', () => {
      const performanceTable: IPerformanceTableEntry[] = [
        {
          criterion: 'crit4',
          dataSource: 'ds4',
          alternative: 'alt1',
          performance: {
            distribution: {type: 'empty'} as TDistributionPerformance
          }
        }
      ];
      try {
        buildPataviPerformanceTable(performanceTable);
      } catch (error) {
        expect(error).toBe('Unrecognized performance');
      }
    });
  });
});

import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IPataviTableEntry} from '@shared/interface/Patavi/IPataviTableEntry';
import {EffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import {TDistributionPerformance} from '@shared/interface/Problem/TDistributionPerformance';
import {buildPataviPerformanceTable, getPataviProblem} from './PataviUtil';

describe('PataviUtil', () => {
  describe('getPataviProblem', () => {
    it('should return a problem for sending to patavi', () => {
      const problem: IProblem = {
        title: 'new problem',
        description: '',
        schemaVersion: 'newest',
        performanceTable: [],
        alternatives: {alt2Id: {id: 'alt2Id', title: 'alt2'}},
        criteria: {
          crit2Id: {id: 'crit2Id'} as IProblemCriterion
        }
      };
      const filteredCriteria: ICriterion[] = [
        {
          id: 'crit1Id',
          title: 'crit1',
          dataSources: [
            {id: 'ds1Id', unitOfMeasurement: {lowerBound: 0, upperBound: 1}}
          ]
        } as ICriterion
      ];
      const filteredAlternatives: IAlternative[] = [
        {id: 'alt1Id', title: 'alt1'}
      ];
      const pvfs: Record<string, IPvf> = {
        crit1Id: {direction: 'increasing', type: 'linear', range: [0, 100]}
      };
      const result = getPataviProblem(
        problem,
        filteredCriteria,
        filteredAlternatives,
        pvfs
      );
      const expectedResult: IPataviProblem = {
        title: 'new problem',
        description: '',
        schemaVersion: 'newest',
        alternatives: {alt1Id: {id: 'alt1Id', title: 'alt1'}},
        criteria: {
          crit1Id: {
            id: 'crit1Id',
            title: 'crit1',
            scale: [0, 1],
            pvf: {direction: 'increasing', type: 'linear', range: [0, 100]}
          }
        },
        performanceTable: []
      };
      expect(result).toEqual(expectedResult);
    });
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

  describe('getScalesCommand', () => {
    it('should', () => {
      fail();
    });
  });
});

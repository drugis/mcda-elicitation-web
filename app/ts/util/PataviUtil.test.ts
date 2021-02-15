import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IPataviTableEntry} from '@shared/interface/Patavi/IPataviTableEntry';
import IScalesCommand from '@shared/interface/Patavi/IScalesCommand';
import {EffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import {TDistributionPerformance} from '@shared/interface/Problem/TDistributionPerformance';
import {
  buildPataviPerformanceTable,
  getPataviProblem,
  getScalesCommand
} from './PataviUtil';

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
    it('should transform and filter the performance table into a patavi ready version', () => {
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
        },
        {
          criterion: 'crit4',
          dataSource: 'ds4',
          alternative: 'alt1',
          performance: {
            effect: {type: 'empty'} as EffectPerformance,
            distribution: {type: 'empty'} as TDistributionPerformance
          }
        },
        {
          criterion: 'crit3',
          dataSource: 'ds3',
          alternative: 'alt2',
          performance: {
            effect: {type: 'empty'} as EffectPerformance,
            distribution: {type: 'empty'} as TDistributionPerformance
          }
        }
      ];
      const includedCriteria: ICriterion[] = [
        {id: 'crit1', dataSources: [{id: 'ds1'}]} as ICriterion,
        {id: 'crit2', dataSources: [{id: 'ds2'}]} as ICriterion,
        {id: 'crit3', dataSources: [{id: 'ds3'}]} as ICriterion
      ];
      const includedAlternatives: IAlternative[] = [
        {id: 'alt1'} as IAlternative
      ];
      const result = buildPataviPerformanceTable(
        performanceTable,
        includedCriteria,
        includedAlternatives
      );
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
        buildPataviPerformanceTable(performanceTable, [], []);
      } catch (error) {
        expect(error).toBe('Unrecognized performance');
      }
    });
  });

  describe('getScalesCommand', () => {
    const problem: IProblem = {
      title: 'new problem',
      description: '',
      schemaVersion: 'newest',
      performanceTable: [
        {
          alternative: 'alt1Id',
          dataSource: 'ds1Id',
          criterion: 'crit1Id',
          performance: {effect: {type: 'empty'}}
        }
      ],
      alternatives: {},
      criteria: {}
    };
    const criteria: ICriterion[] = [
      {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id', unitOfMeasurement: {type: 'percentage'}}]
      } as ICriterion
    ];
    const alternatives: IAlternative[] = [{id: 'alt1Id', title: 'alt1'}];

    it('should return a scales command for patavi where criteria are keyed by datasource ids', () => {
      const result = getScalesCommand(problem, criteria, alternatives);
      const expectedResult: IScalesCommand = {
        title: 'new problem',
        method: 'scales',
        description: '',
        schemaVersion: 'newest',
        preferences: undefined,
        alternatives: {alt1Id: {id: 'alt1Id', title: 'alt1'}},
        criteria: {
          ds1Id: {title: undefined, id: 'ds1Id', pvf: undefined, scale: [0, 1]}
        },
        performanceTable: [
          {
            alternative: 'alt1Id',
            dataSource: 'ds1Id',
            criterion: 'ds1Id',
            performance: {type: 'empty'}
          }
        ]
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

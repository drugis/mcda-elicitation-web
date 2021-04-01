import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IWorkspace from '@shared/interface/IWorkspace';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IRelativePataviTableEntry} from '@shared/interface/Patavi/IRelativePataviTableEntry';
import IScalesCommand from '@shared/interface/Patavi/IScalesCommand';
import {TPataviPerformanceTableEntry} from '@shared/interface/Patavi/TPataviPerfomanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import {TPreferences} from '@shared/types/Preferences';
import {
  buildPataviPerformanceTable,
  getPataviProblem,
  getScalesCommand
} from './PataviUtil';

describe('PataviUtil', () => {
  describe('getPataviProblem', () => {
    it('should return a problem for sending to patavi', () => {
      const workspace: IWorkspace = {
        alternatives: [{id: 'alt1Id', title: 'alt1'}],
        criteria: [
          {
            id: 'crit1Id',
            title: 'crit1',
            dataSources: [
              {id: 'ds1Id', unitOfMeasurement: {lowerBound: 0, upperBound: 1}}
            ]
          } as ICriterion
        ],
        effects: [],
        distributions: [],
        relativePerformances: []
      } as IWorkspace;
      const pvfs: Record<string, ILinearPvf> = {
        crit1Id: {direction: 'increasing', type: 'linear', range: [0, 100]}
      };
      const preferences: TPreferences = [];
      const result = getPataviProblem(workspace, preferences, pvfs, false);
      const expectedResult: IPataviProblem = {
        alternatives: {alt1Id: {id: 'alt1Id', title: 'alt1'}},
        criteria: {
          crit1Id: {
            id: 'crit1Id',
            title: 'crit1',
            scale: [0, 1],
            pvf: {direction: 'increasing', type: 'linear', range: [0, 100]}
          }
        },
        performanceTable: [],
        preferences: preferences
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('buildPataviPerformanceTable', () => {
    const workspace: IWorkspace = {
      effects: [
        {
          alternativeId: 'alt1',
          criterionId: 'crit1',
          dataSourceId: 'ds1',
          value: 37,
          type: 'value'
        },
        {
          alternativeId: 'alt1',
          criterionId: 'crit2',
          dataSourceId: 'ds2',
          value: 38,
          type: 'value'
        }
      ],
      distributions: [
        {
          alternativeId: 'alt1',
          criterionId: 'crit1',
          dataSourceId: 'ds1',
          type: 'normal',
          mean: 3.7,
          standardError: 0.42
        }
      ],
      relativePerformances: [
        {
          baseline: {},
          relative: {},
          dataSourceId: 'ds3',
          criterionId: 'crit3',
          type: 'relative-logit-normal'
        }
      ]
    } as IWorkspace;

    it('should transform the effects to a patavi ready version when distributions get priority over effects', () => {
      const result = buildPataviPerformanceTable(workspace, false);
      const expectedResult: TPataviPerformanceTableEntry[] = [
        {
          criterion: 'crit1',
          dataSource: 'ds1',
          alternative: 'alt1',
          performance: {
            type: 'dnorm',
            parameters: {mu: 3.7, sigma: 0.42}
          }
        },
        {
          criterion: 'crit2',
          dataSource: 'ds2',
          alternative: 'alt1',
          performance: {type: 'exact', value: 38}
        },
        {
          criterion: 'crit3',
          dataSource: 'ds3',
          performance: {
            type: 'relative-logit-normal',
            parameters: {baseline: {}, relative: {}}
          }
        } as IRelativePataviTableEntry
      ];
      expect(result).toEqual(expectedResult);
    });
    it('should transform the effects to a patavi ready version when effects get priority over distributions', () => {
      const result = buildPataviPerformanceTable(workspace, true);
      const expectedResult: TPataviPerformanceTableEntry[] = [
        {
          criterion: 'crit1',
          dataSource: 'ds1',
          alternative: 'alt1',
          performance: {type: 'exact', value: 37}
        },
        {
          criterion: 'crit2',
          dataSource: 'ds2',
          alternative: 'alt1',
          performance: {type: 'exact', value: 38}
        },
        {
          criterion: 'crit3',
          dataSource: 'ds3',
          performance: {
            type: 'relative-logit-normal',
            parameters: {baseline: {}, relative: {}}
          }
        } as IRelativePataviTableEntry
      ];
      expect(result).toEqual(expectedResult);
    });
    it('should throw an error if there is an invalid performance', () => {
      const workspace: IWorkspace = {
        distributions: [
          {
            criterionId: 'crit4',
            dataSourceId: 'ds4',
            alternativeId: 'alt1',
            type: 'empty'
          }
        ]
      } as IWorkspace;
      expect(() => {
        buildPataviPerformanceTable(workspace, false);
      }).toThrow(
        'Attempt to create invalid performance table entry for Patavi'
      );
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
        method: 'scales',
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

import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import IWorkspace from '@shared/interface/IWorkspace';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {
  applySubproblem,
  getConfiguredRanges,
  getMagnitude,
  getStepSize
} from './SubproblemUtil';

describe('The Subproblem util', () => {
  describe('applySubproblem', () => {
    const criteria: ICriterion[] = [
      {
        id: 'crit1Id',
        dataSources: [
          {
            id: 'ds1Id'
          },
          {
            id: 'ds2Id'
          }
        ]
      } as ICriterion,
      {
        id: 'crit2Id',
        dataSources: [
          {
            id: 'ds3Id'
          }
        ]
      } as ICriterion
    ];
    const alternatives: IAlternative[] = [
      {
        id: 'alt1Id',
        title: 'alternative 1'
      },
      {
        id: 'alt2Id',
        title: 'alternative 2'
      }
    ];
    const fullEffects = [
      {
        criterionId: 'crit1Id',
        dataSourceId: 'ds1Id',
        alternativeId: 'alt1Id'
      } as Effect,
      {
        criterionId: 'crit1Id',
        dataSourceId: 'ds2Id',
        alternativeId: 'alt1Id'
      } as Effect,
      {
        criterionId: 'crit2Id',
        dataSourceId: 'ds3Id',
        alternativeId: 'alt1Id'
      } as Effect,
      {
        criterionId: 'crit1Id',
        dataSourceId: 'ds1Id',
        alternativeId: 'alt2Id'
      } as Effect,
      {
        criterionId: 'crit1Id',
        dataSourceId: 'ds2Id',
        alternativeId: 'alt2Id'
      } as Effect,
      {
        criterionId: 'crit2Id',
        dataSourceId: 'ds3Id',
        alternativeId: 'alt2Id'
      } as Effect
    ];
    const baseWorkspace: IWorkspace = {
      criteria: criteria,
      alternatives: alternatives,
      effects: fullEffects,
      distributions: fullEffects,
      relativePerformances: []
    } as IWorkspace;

    const reducedCriteria: ICriterion[] = [
      {
        id: 'crit2Id',
        dataSources: [
          {
            id: 'ds3Id'
          }
        ]
      } as ICriterion
    ];

    const reducedAlternatives = [
      {
        id: 'alt1Id',
        title: 'alternative 1'
      }
    ];

    it('should work for no exclusions', () => {
      const noExclusions = {definition: {}} as IOldSubproblem;
      const result = applySubproblem(baseWorkspace, noExclusions);
      expect(result).toEqual(baseWorkspace);
    });

    it('should exclude criteria', () => {
      const excludeCrit1 = {
        definition: {excludedCriteria: ['crit1Id']}
      } as IOldSubproblem;
      const reducedEffects = [
        {
          criterionId: 'crit2Id',
          dataSourceId: 'ds3Id',
          alternativeId: 'alt1Id'
        } as Effect,
        {
          criterionId: 'crit2Id',
          dataSourceId: 'ds3Id',
          alternativeId: 'alt2Id'
        } as Effect
      ];
      const expectedResult = {
        ...baseWorkspace,
        criteria: reducedCriteria,
        effects: reducedEffects,
        distributions: reducedEffects
      };
      const result = applySubproblem(baseWorkspace, excludeCrit1);
      expect(result).toEqual(expectedResult);
    });

    it('should exclude alternatives', () => {
      const excludeAlt2 = {
        definition: {
          excludedAlternatives: ['alt2Id']
        }
      } as IOldSubproblem;
      const reducedEffects = [
        {
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          alternativeId: 'alt1Id'
        } as Effect,
        {
          criterionId: 'crit1Id',
          dataSourceId: 'ds2Id',
          alternativeId: 'alt1Id'
        } as Effect,
        {
          criterionId: 'crit2Id',
          dataSourceId: 'ds3Id',
          alternativeId: 'alt1Id'
        } as Effect
      ];
      const expectedResult = {
        ...baseWorkspace,
        alternatives: reducedAlternatives,
        effects: reducedEffects,
        distributions: reducedEffects
      };
      const result = applySubproblem(baseWorkspace, excludeAlt2);
      expect(result).toEqual(expectedResult);
    });

    it('should exclude alternatives in relative problems', () => {
      const excludeAlt2 = {
        definition: {
          excludedAlternatives: ['alt2Id'],
          excludedCriteria: ['crit1Id']
        }
      } as IOldSubproblem;

      const inputRelativePerformances: IRelativePerformance[] = [
        {
          dataSourceId: 'ds3Id',
          criterionId: 'crit2Id',
          type: 'relative-cloglog-normal',
          baseline: {
            type: 'dnorm',
            name: 'alt1Id'
          },
          relative: {
            cov: {
              rownames: ['alt1Id', 'alt2Id'],
              colnames: ['alt1Id', 'alt2Id'],
              data: [
                [0, 0],
                [0, 1]
              ]
            },
            mu: {alt1Id: 0, alt2Id: 0.5},
            type: 'dmnorm'
          }
        }
      ];

      const result = applySubproblem(
        {
          ...baseWorkspace,
          effects: [],
          distributions: [],
          relativePerformances: inputRelativePerformances
        },
        excludeAlt2
      );

      const reducedRelativePerformances: IRelativePerformance[] = [
        {
          dataSourceId: 'ds3Id',
          criterionId: 'crit2Id',
          type: 'relative-cloglog-normal',
          baseline: {
            type: 'dnorm',
            name: 'alt1Id'
          },
          relative: {
            cov: {rownames: ['alt1Id'], colnames: ['alt1Id'], data: [[0]]},
            mu: {alt1Id: 0},
            type: 'dmnorm'
          }
        }
      ];

      const expectedResult = {
        ...baseWorkspace,
        criteria: reducedCriteria,
        alternatives: reducedAlternatives,
        effects: [] as Effect[],
        distributions: [] as Distribution[],
        relativePerformances: reducedRelativePerformances
      };
      expect(result).toEqual(expectedResult);
    });

    it('should exclude data sources', () => {
      const excludeDataSource2 = {
        definition: {
          excludedDataSources: ['ds2Id']
        }
      } as IOldSubproblem;
      const reducedEffects = [
        {
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          alternativeId: 'alt1Id'
        } as Effect,
        {
          criterionId: 'crit2Id',
          dataSourceId: 'ds3Id',
          alternativeId: 'alt1Id'
        } as Effect,
        {
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          alternativeId: 'alt2Id'
        } as Effect,
        {
          criterionId: 'crit2Id',
          dataSourceId: 'ds3Id',
          alternativeId: 'alt2Id'
        } as Effect
      ];
      const expectedResult = {
        ...baseWorkspace,
        criteria: [
          {
            id: 'crit1Id',
            dataSources: [
              {
                id: 'ds1Id'
              }
            ]
          } as ICriterion,
          {
            id: 'crit2Id',
            dataSources: [
              {
                id: 'ds3Id'
              }
            ]
          } as ICriterion
        ],
        effects: reducedEffects,
        distributions: reducedEffects
      };
      const result = applySubproblem(baseWorkspace, excludeDataSource2);
      expect(result).toEqual(expectedResult);
    });

    it('should exclude all the things', () => {
      const exclusions = {
        definition: {
          excludedCriteria: ['crit2Id'],
          excludedDataSources: ['ds2Id'],
          excludedAlternatives: ['alt2Id']
        }
      } as IOldSubproblem;
      const reducedEffects = [
        {
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          alternativeId: 'alt1Id'
        } as Effect
      ];
      const expectedResult = {
        ...baseWorkspace,
        criteria: [
          {
            id: 'crit1Id',
            dataSources: [
              {
                id: 'ds1Id'
              }
            ]
          } as IProblemCriterion
        ],
        alternatives: reducedAlternatives,
        effects: reducedEffects,
        distributions: reducedEffects
      };
      const result = applySubproblem(baseWorkspace, exclusions);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getStepSize', () => {
    it('should return the calculated step size and magnitude for a configured range', () => {
      const configuredRange: [number, number] = [0, 1];
      const result = getStepSize(configuredRange, undefined);
      const expectedResult = 0.1;
      expect(result).toEqual(expectedResult);
    });

    it('should return the predefined step size and magnitude ', () => {
      const configuredRange: [number, number] = [0, 1];
      const result = getStepSize(configuredRange, 0.01);
      const expectedResult = 0.01;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMagnitude', () => {
    it('should return the calculated step size and magnitude for a configured range', () => {
      const configuredRange: [number, number] = [0, 1];
      const result = getMagnitude(configuredRange, undefined);
      const expectedResult = -1;
      expect(result).toEqual(expectedResult);
    });

    it('should return the predefined step size and magnitude ', () => {
      const configuredRange: [number, number] = [0, 1];
      const result = getMagnitude(configuredRange, 0.01);
      const expectedResult = -2;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getConfiguredRanges', () => {
    it('should return the configured ranges', () => {
      const criteria: ICriterion[] = [
        {
          id: 'crit1Id',
          dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]
        } as ICriterion
      ];
      const observedRanges: Record<string, [number, number]> = {
        ds1Id: [0, 100]
      };
      const configuredRanges: Record<string, [number, number]> = {
        ds1Id: [0, 10]
      };
      const result = getConfiguredRanges(
        criteria,
        observedRanges,
        configuredRanges
      );
      const expectedResult: Record<string, [number, number]> = {ds1Id: [0, 10]};
      expect(result).toEqual(expectedResult);
    });

    it('should return the observed ranges', () => {
      const criteria: ICriterion[] = [
        {id: 'crit1Id', dataSources: [{id: 'ds1Id'}]} as ICriterion
      ];
      const observedRanges: Record<string, [number, number]> = {
        ds1Id: [0, 100]
      };
      const configuredRanges = {};
      const result = getConfiguredRanges(
        criteria,
        observedRanges,
        configuredRanges
      );
      const expectedResult: Record<string, [number, number]> = {
        ds1Id: [0, 100]
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Effect} from '@shared/interface/IEffect';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IWorkspace from '@shared/interface/IWorkspace';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {applySubproblem} from './SubproblemUtil';

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
        criteria: [
          {
            id: 'crit2Id',
            dataSources: [
              {
                id: 'ds3Id'
              }
            ]
          } as IProblemCriterion
        ],
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
        alternatives: [
          {
            id: 'alt1Id',
            title: 'alternative 1'
          }
        ],
        effects: reducedEffects,
        distributions: reducedEffects
      };
      const result = applySubproblem(baseWorkspace, excludeAlt2);
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
        alternatives: [
          {
            id: 'alt1Id',
            title: 'alternative 1'
          }
        ],
        effects: reducedEffects,
        distributions: reducedEffects
      };
      const result = applySubproblem(baseWorkspace, exclusions);
      expect(result).toEqual(expectedResult);
    });
  });
});

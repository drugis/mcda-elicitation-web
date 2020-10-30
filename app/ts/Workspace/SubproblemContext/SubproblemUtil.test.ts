import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {applySubproblem} from './SubproblemUtil';

describe('The Subproblem util', () => {
  describe('applySubproblem', () => {
    const baseWorkspace: IOldWorkspace = {
      defaultScenarioId: 'foo',
      defaultSubproblemId: 'bar',
      owner: 3,
      problem: {
        description: 'foo',
        schemaVersion: '1',
        title: 'x',
        criteria: {
          crit1Id: {
            id: 'crit1Id',
            dataSources: [
              {
                id: 'ds1Id'
              },
              {
                id: 'ds2Id'
              }
            ]
          } as IProblemCriterion,
          crit2Id: {
            id: 'crit2Id',
            dataSources: [
              {
                id: 'ds3Id'
              }
            ]
          } as IProblemCriterion
        },
        alternatives: {
          alt1Id: {
            id: 'alt1Id',
            title: 'alternative 1'
          },
          alt2Id: {
            id: 'alt2Id',
            title: 'alternative 2'
          }
        },
        performanceTable: [
          {
            criterion: 'crit1Id',
            dataSource: 'ds1Id',
            alternative: 'alt1Id'
          } as IPerformanceTableEntry,
          {
            criterion: 'crit1Id',
            dataSource: 'ds2Id',
            alternative: 'alt1Id'
          } as IPerformanceTableEntry,
          {
            criterion: 'crit2Id',
            dataSource: 'ds3Id',
            alternative: 'alt1Id'
          } as IPerformanceTableEntry,
          {
            criterion: 'crit1Id',
            dataSource: 'ds1Id',
            alternative: 'alt2Id'
          } as IPerformanceTableEntry,
          {
            criterion: 'crit1Id',
            dataSource: 'ds2Id',
            alternative: 'alt2Id'
          } as IPerformanceTableEntry,
          {
            criterion: 'crit2Id',
            dataSource: 'ds3Id',
            alternative: 'alt2Id'
          } as IPerformanceTableEntry
        ]
      } as IProblem
    };

    it('should work for undefined exclusions', () => {
      const noExclusions = {definition: {}} as IOldSubproblem;
      const result = applySubproblem(baseWorkspace, noExclusions);
      expect(result).toEqual(baseWorkspace);
    });

    it('should exclude criteria', () => {
      const excludeCrit1 = {
        definition: {excludedCriteria: ['crit1Id']}
      } as IOldSubproblem;
      const expectedResult = {
        ...baseWorkspace,
        problem: {
          ...baseWorkspace.problem,
          criteria: {
            crit2Id: {
              id: 'crit2Id',
              dataSources: [
                {
                  id: 'ds3Id'
                }
              ]
            } as IProblemCriterion
          },
          performanceTable: [
            {
              criterion: 'crit2Id',
              dataSource: 'ds3Id',
              alternative: 'alt1Id'
            } as IPerformanceTableEntry,
            {
              criterion: 'crit2Id',
              dataSource: 'ds3Id',
              alternative: 'alt2Id'
            } as IPerformanceTableEntry
          ]
        } as IProblem
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
      const expectedResult = {
        ...baseWorkspace,
        problem: {
          ...baseWorkspace.problem,
          alternatives: {
            alt1Id: {
              id: 'alt1Id',
              title: 'alternative 1'
            }
          },
          performanceTable: [
            {
              criterion: 'crit1Id',
              dataSource: 'ds1Id',
              alternative: 'alt1Id'
            } as IPerformanceTableEntry,
            {
              criterion: 'crit1Id',
              dataSource: 'ds2Id',
              alternative: 'alt1Id'
            } as IPerformanceTableEntry,
            {
              criterion: 'crit2Id',
              dataSource: 'ds3Id',
              alternative: 'alt1Id'
            } as IPerformanceTableEntry
          ]
        }
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
      const expectedResult = {
        ...baseWorkspace,
        problem: {
          ...baseWorkspace.problem,
          criteria: {
            crit1Id: {
              id: 'crit1Id',
              dataSources: [
                {
                  id: 'ds1Id'
                }
              ]
            } as IProblemCriterion,
            crit2Id: {
              id: 'crit2Id',
              dataSources: [
                {
                  id: 'ds3Id'
                }
              ]
            } as IProblemCriterion
          },
          performanceTable: [
            {
              criterion: 'crit1Id',
              dataSource: 'ds1Id',
              alternative: 'alt1Id'
            } as IPerformanceTableEntry,
            {
              criterion: 'crit2Id',
              dataSource: 'ds3Id',
              alternative: 'alt1Id'
            } as IPerformanceTableEntry,
            {
              criterion: 'crit1Id',
              dataSource: 'ds1Id',
              alternative: 'alt2Id'
            } as IPerformanceTableEntry,
            {
              criterion: 'crit2Id',
              dataSource: 'ds3Id',
              alternative: 'alt2Id'
            } as IPerformanceTableEntry
          ]
        }
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
      const expectedResult = {
        ...baseWorkspace,
        problem: {
          ...baseWorkspace.problem,
          criteria: {
            crit1Id: {
              id: 'crit1Id',
              dataSources: [
                {
                  id: 'ds1Id'
                }
              ]
            } as IProblemCriterion
          },
          alternatives: {
            alt1Id: {
              id: 'alt1Id',
              title: 'alternative 1'
            }
          },
          performanceTable: [
            {
              criterion: 'crit1Id',
              dataSource: 'ds1Id',
              alternative: 'alt1Id'
            } as IPerformanceTableEntry
          ]
        }
      };
      const result = applySubproblem(baseWorkspace, exclusions);
      expect(result).toEqual(expectedResult);
    });
  });
});

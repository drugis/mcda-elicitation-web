import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import _ from 'lodash';
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
              {id: 'ds2Id'}
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
        performanceTable: buildPerformanceTable(
          ['crit1Id', 'crit2Id'],
          ['alt1Id', 'alt2Id'],
          ['ds1Id', 'ds2Id', 'ds3Id']
        )
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
                  id: 'ds2Id'
                }
              ]
            } as IProblemCriterion
          }
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
          }
        }
      };
      const result = applySubproblem(baseWorkspace, excludeAlt2);
      expect(result).toEqual(expectedResult);
    });
  });
});

function buildPerformanceTable(
  criteria: Record<string, IProblemCriterion>,
  altIds: string[]
): IPerformanceTableEntry[] {
  const combinations: {
    critId: string;
    altId: string;
    dsId: string;
  }[] = _.reduce(criteria, (accum, criterion) => {
    return accum.concat(entriesForCriterion());
  });
  return _.map(
    combinations,
    ({critId, altId, dsId}): IPerformanceTableEntry => {
      return {
        criterion: critId,
        alternative: altId,
        dataSource: dsId
      } as IPerformanceTableEntry;
    }
  );
}

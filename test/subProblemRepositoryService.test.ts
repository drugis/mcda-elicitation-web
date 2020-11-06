import IOldSubproblem from '@shared/interface/IOldSubproblem';
import {formatSubproblem} from '../node-backend/subproblemRepositoryService';

describe('subproblemRepositoryService', () => {
  describe('formatSubproblem', () => {
    it('should put empty arrays on properties that are undefined', () => {
      const legacySubproblem = {
        id: 'someId',
        title: 'old subproblem',
        workspaceId: '37',
        definition: {ranges: {}}
      };
      const result = formatSubproblem(legacySubproblem);
      const expectedResult: IOldSubproblem = {
        id: legacySubproblem.id,
        title: legacySubproblem.title,
        workspaceId: legacySubproblem.workspaceId,
        definition: {
          excludedAlternatives: [],
          excludedCriteria: [],
          excludedDataSources: [],
          ranges: {}
        }
      };
      expect(result).toEqual(expectedResult);
    });

    it('should remove pvf layers from the ranges if it finds any', () => {
      const legacySubproblem = {
        id: 'someId',
        title: 'old subproblem',
        workspaceId: '37',
        definition: {
          excludedAlternatives: [] as string[],
          excludedCriteria: [] as string[],
          excludedDataSources: [] as string[],
          ranges: {
            ds1Id: {
              pvf: {
                range: [0, 42]
              }
            }
          }
        }
      };
      const result = formatSubproblem(legacySubproblem);
      const expectedResult: IOldSubproblem = {
        id: legacySubproblem.id,
        title: legacySubproblem.title,
        workspaceId: legacySubproblem.workspaceId,
        definition: {
          excludedAlternatives: [],
          excludedCriteria: [],
          excludedDataSources: [],
          ranges: {ds1Id: [0, 42]}
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

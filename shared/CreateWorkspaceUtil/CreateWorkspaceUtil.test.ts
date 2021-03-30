import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import IUploadProblemCriterion from '@shared/interface/UploadProblem/IUploadProblemCriterion';
import {extractPvfs, extractRanges} from './CreateWorkspaceUtil';

describe('CreateWorkspaceUtil', () => {
  const criteria: Record<string, IUploadProblemCriterion> = {
    crit1Id: {
      id: 'crit1Id',
      dataSources: [
        {
          id: 'ds1Id',
          pvf: {direction: 'increasing', range: [0, 1], type: 'linear'}
        }
      ]
    } as IUploadProblemCriterion,
    crit2Id: {
      id: 'crit2Id',
      dataSources: [
        {
          id: 'ds2Id',
          pvf: {range: [0, 1]}
        }
      ]
    } as IUploadProblemCriterion,
    crit3Id: {
      id: 'crit3Id',
      dataSources: [
        {
          id: 'ds3Id',
          pvf: {
            direction: 'decreasing',
            range: [0, 1],
            type: 'piecewise-linear',
            cutoffs: [0.25, 0.5, 0.75],
            values: [0.1, 0.2, 0.3]
          }
        },
        {
          id: 'ds4Id'
        }
      ]
    } as IUploadProblemCriterion
  };

  describe('extractPvfs', () => {
    it('should return pvfs with direction and without range keyed by criterion ids', () => {
      const result = extractPvfs(criteria);
      const expectedResult: Record<string, TScenarioPvf> = {
        crit1Id: {direction: 'increasing', type: 'linear'},
        crit3Id: {
          direction: 'decreasing',
          type: 'piecewise-linear',
          cutoffs: [0.25, 0.5, 0.75],
          values: [0.1, 0.2, 0.3]
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('extractRanges', () => {
    it('should return ranges keyed by data source id', () => {
      const result = extractRanges(criteria);
      const expectedResult: Record<string, [number, number]> = {
        ds1Id: [0, 1],
        ds2Id: [0, 1],
        ds3Id: [0, 1]
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

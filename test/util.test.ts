import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IScenarioCriterion from '@shared/interface/Scenario/IScenarioCriterion';
import IUploadProblem from '@shared/interface/UploadProblem/IUploadProblem';
import IUploadProblemCriterion from '@shared/interface/UploadProblem/IUploadProblemCriterion';
import {
  buildScenarioCriteria,
  getRanges,
  getUser,
  handleError
} from '../node-backend/util';
import {TScenarioPvf} from '../shared/interface/Scenario/TScenarioPvf';

describe('The utility', () => {
  describe('getUser', () => {
    const userId = 'user1';
    const expectedResult = {id: userId};
    it('should return the user if it is on the request', () => {
      const request: any = {
        user: {id: userId}
      };
      const result = getUser(request);
      expect(result).toEqual(expectedResult);
    });

    it('should return the user if it is on the session of the request', () => {
      const userId = 'user1';
      const request: any = {
        session: {
          user: {id: userId}
        }
      };
      const result = getUser(request);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if there is no user on the request', () => {
      const request: any = {};
      expect(() => {
        getUser(request);
      }).toThrow('No user id found');
    });
  });

  describe('createScenarioProblem', () => {
    it('should create a scenario problem from an uploaded problem and pvfs', () => {
      const criteria = {
        crit1Id: {} as IProblemCriterion
      };
      const pvfs: Record<string, TScenarioPvf> = {
        crit1Id: {
          direction: 'increasing',
          type: 'linear'
        }
      };
      const result = buildScenarioCriteria(criteria, pvfs);
      const expectedResult: Record<string, IScenarioCriterion> = {
        crit1Id: {
          dataSources: [{pvf: {direction: 'increasing', type: 'linear'}}]
        }
      };
      expect(result).toEqual(expectedResult);
    });

    it('should create a scenario problem from an uploaded problem without pvfs if there are too many data sources', () => {
      const criteria = {
        crit1Id: {
          dataSources: [{id: 'ds1Id'}, {id: 'ds1Id'}]
        } as IProblemCriterion
      };
      const pvfs: Record<string, TScenarioPvf> = {
        crit1Id: {
          direction: 'increasing',
          type: 'linear'
        }
      };
      const result = buildScenarioCriteria(criteria, pvfs);
      const expectedResult: Record<string, IScenarioCriterion> = {};
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getRanges', () => {
    it('should return the scales ranges from a problem', () => {
      const problem: IUploadProblem = {
        schemaVersion: 'schemaVersion,',
        alternatives: {},
        description: 'desc',
        performanceTable: [],
        title: 'title',
        criteria: {
          critId1: {
            dataSources: [{id: 'ds1Id', pvf: {range: [3, 5]}}]
          } as IUploadProblemCriterion,
          critId2: {
            dataSources: [{id: 'ds2Id', pvf: {range: [1, 3]}}]
          } as IUploadProblemCriterion
        }
      };

      const result = getRanges(problem);

      const expectedResult = {
        ds1Id: [3, 5],
        ds2Id: [1, 3]
      };
      expect(expectedResult).toEqual(result);
    });
  });

  describe('handleError', () => {
    it('should call next with an error object if an error occurs', () => {
      const error = {message: 'some error that occured'};
      const next = jest.fn();
      handleError(error, next);
      const expectedResult = {
        statusCode: 500,
        message: error.message
      };
      expect(next.mock.calls.length).toBe(1);
      expect(next.mock.calls[0][0]).toEqual(expectedResult);
    });
  });
});

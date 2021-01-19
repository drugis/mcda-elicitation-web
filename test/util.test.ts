import {
  createScenarioProblem,
  getRanges,
  getUser,
  handleError
} from '../node-backend/util';
import IScenarioCriterion from '../shared/interface/Scenario/IScenarioCriterion';
import IUploadProblem from '../shared/interface/UploadProblem/IUploadProblem';
import IUploadProblemCriterion from '../shared/interface/UploadProblem/IUploadProblemCriterion';

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
      try {
        getUser(request);
      } catch (error) {
        expect(error).toBe('No user id found');
      }
    });
  });

  describe('createScenarioProblem', () => {
    it('should create a scenario problem from an uploaded problem with pvfs', () => {
      const criteria = {
        crit1Id: {
          id: 'crit1Id',
          dataSources: [
            {
              id: 'ds1Id',
              pvf: {
                direction: 'increasing',
                type: 'linear',
                range: [0, 100]
              }
            }
          ]
        } as IUploadProblemCriterion
      };
      const result = createScenarioProblem(criteria);
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
          id: 'crit1Id',
          dataSources: [
            {
              id: 'ds1Id'
            },
            {
              id: 'ds2Id'
            }
          ]
        } as IUploadProblemCriterion
      };
      const result = createScenarioProblem(criteria);
      const expectedResult: Record<string, IScenarioCriterion> = {};
      expect(result).toEqual(expectedResult);
    });
  });

  it('should create a scenario problem from an uploaded problem without pvfs if there are no data sources', () => {
    const criteria = {
      crit1Id: {
        id: 'crit1Id',
        dataSources: []
      } as IUploadProblemCriterion
    };
    const result = createScenarioProblem(criteria);
    const expectedResult: Record<string, IScenarioCriterion> = {};
    expect(result).toEqual(expectedResult);
  });

  it('should create a scenario problem from an uploaded problem without pvfs if there are no pvfs on data sources', () => {
    const criteria = {
      crit1Id: {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id'}]
      } as IUploadProblemCriterion
    };
    const result = createScenarioProblem(criteria);
    const expectedResult: Record<string, IScenarioCriterion> = {};
    expect(result).toEqual(expectedResult);
  });

  it('should create a scenario problem from an uploaded problem without pvfs if data source pvfs contain only range', () => {
    const criteria = {
      crit1Id: {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id', pvf: {range: [0, 100]}}]
      } as IUploadProblemCriterion
    };
    const result = createScenarioProblem(criteria);
    const expectedResult: Record<string, IScenarioCriterion> = {};
    expect(result).toEqual(expectedResult);
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

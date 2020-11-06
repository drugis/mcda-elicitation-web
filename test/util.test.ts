'use strict';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import {
  getRanges,
  getUser,
  handleError,
  reduceProblem
} from '../node-backend/util';

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

  describe('reduceProblem', () => {
    it('should reduce the problem to only the parts needed', () => {
      const problem: any = {
        prefs: 'some prefs',
        criteria: {
          critId1: {
            id: 'critId1',
            pvf: {},
            scale: [1, 2],
            title: 'crit 1 title'
          }
        }
      };

      const result = reduceProblem(problem);

      const expectedResult = {
        criteria: {
          critId1: {
            scale: [1, 2],
            pvf: {},
            title: 'crit 1 title'
          }
        },
        prefs: problem.preferences
      };
      expect(expectedResult).toEqual(result);
    });
  });

  describe('getRanges', () => {
    it('should return the scales ranges from a problem', () => {
      const problem: IProblem = {
        schemaVersion: 'schemaVersion,',
        alternatives: {},
        description: 'desc',
        performanceTable: [],
        title: 'title',
        criteria: {
          critId1: {
            dataSources: [
              {id: 'ds1Id', pvf: {range: [3, 5]}} as IProblemDataSource
            ]
          } as IProblemCriterion,
          critId2: {
            dataSources: [
              {id: 'ds2Id', pvf: {range: [1, 3]}} as IProblemDataSource
            ]
          } as IProblemCriterion
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

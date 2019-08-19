'use strict';
const util = require('../node-backend/util');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;


describe('The utility', function() {
  describe('reduceProblem', function() {
    it('should reduce the problem to only the parts needed', function() {
      var problem = {
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
      var expectedResult = {
        criteria: {
          critId1: {
            scale: [1, 2],
            pvf: {},
            title: 'crit 1 title'
          }
        },
        prefs: problem.prefs
      };
      var result = util.reduceProblem(problem);
      assert.deepEqual(expectedResult, result);
    });
  });

  describe('getRanges', function() {
    it('should return the scales ranges from a problem', function() {
      var problem = {
        prefs: 'some prefs',
        criteria: {
          critId1: {
            id: 'critId1',
            pvf: { range: [3, 5] },
            scale: [1, 2],
            title: 'crit 1 title'
          },
          critId2: {
            pvf: { range: [1, 3] }
          }
        }
      };
      var expectedResult = {
        critId1: {
          pvf: {
            range: [3, 5]
          }
        },
        critId2: {
          pvf: {
            range: [1, 3]
          }
        }
      };
      var result = util.getRanges(problem);
      assert.deepEqual(expectedResult, result);
    });
  });

  describe('getUser', function() {
    it('should return the user if it is on the request', function() {
      var userId = 'user1';
      var req = {
        user: userId
      };
      var result = util.getUser(req);
      expect(result).to.equal(userId);
    });

    it('should return the user if it is on the session of the request', function() {
      var userId = 'user1';
      var req = {
        session: {
          user: userId
        }
      };
      var result = util.getUser(req);
      expect(result).to.equal(userId);
    });
  });

  describe('checkForError', function() {
    it('should call next with an error object if an error occurs', function() {
      const error = 'some error that occured';
      const next = chai.spy();
      util.checkForError(error, next);
      var expectedResult = {
        statusCode: 500,
        message: error
      };
      expect(next).to.be.have.been.called.with(expectedResult);
    });
  });

});

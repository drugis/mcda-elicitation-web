'use strict';
var util = require('../node-backend/util');
var assert = require('assert');
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
});

'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function () {
    console.log('query being called');
  }
};
var orderingRepository = require('../node-backend/orderingRepository')(dbStub);
var query;

function initDBStub() {
  beforeEach(() => {
    query = sinon.stub(dbStub, 'query');
  });
  afterEach(() => {
    query.restore();
  });
}

describe('the ordering repository', function () {
  var expectedError = 'error';
  var workspaceId = 1;

  describe('get', function () {
    initDBStub();

    var expectedQuery =
      'SELECT workspaceId AS "workspaceId", ordering FROM ordering WHERE workspaceId = $1';
    var queryInputValues = [workspaceId];

    it('should get the ordering and call the callback with the result', function (done) {
      var queryResult = {
        rows: [
          {
            ordering: {}
          }
        ]
      };
      var expectedResult = queryResult.rows[0].ordering;
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        expectedResult,
        done
      );
      orderingRepository.get(workspaceId, callback);
    });

    it('should call the callback without arguments if the results are empty', function (done) {
      var queryResult = {
        rows: []
      };
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        undefined,
        done
      );
      orderingRepository.get(workspaceId, callback);
    });

    it('should call the callback with only an error', function (done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        expectedError,
        done
      );
      orderingRepository.get(workspaceId, callback);
    });
  });

  describe('updateDirect', function () {
    initDBStub();
    const ordering = {};
    const expectedQuery =
      'INSERT INTO ordering(workspaceId, ordering) values($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET ordering=$2';
    const queryInputValues = [workspaceId, ordering];

    it('should update the ordering', function (done) {
      const callback = testUtil.createQueryNoArgumentCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        done
      );
      query.onCall(0).yields(null);
      orderingRepository.updateDirect(workspaceId, ordering, callback);
    });

    it('should call the callback with only an error', function (done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        expectedError,
        done
      );
      orderingRepository.updateDirect(workspaceId, ordering, callback);
    });
  });
});

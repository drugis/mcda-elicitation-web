'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function() {
    console.log('query being called');
  }
};
var subProblemRepository = require('../node-backend/subProblemRepository')(dbStub);

describe('the subproblem repository', function() {
  var workspaceId = 1;
  var expectedError = 'some expected error';

  describe('create', function() {
    var query;
    const expectedQuery = 'INSERT INTO subProblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id';
    const workspaceId = 10;
    const definition = {
      blob: 'with values'
    };
    var queryInputValues = [workspaceId, 'Default', definition];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should create a subproblem and return the id', function(done) {
      const createdId = 32;
      var queryResult = {
        rows: [{ id: createdId }]
      };
      var expectedResult1 = workspaceId;
      var expectedResult2 = createdId;
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryTwoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult1, expectedResult2, done);
      subProblemRepository.create(workspaceId, definition, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      subProblemRepository.create(workspaceId, definition, callback);
    });
  });
});

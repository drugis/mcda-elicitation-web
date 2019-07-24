'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function() {
    console.log('query being called');
  }
};
var scenarioRepository = require('../node-backend/scenarioRepository')(dbStub);

describe('the scenario repository', function() {
  var expectedError = 'some expected error';

  describe('create', function() {
    var query;
    const expectedQuery = 'INSERT INTO scenario (workspace, subproblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id';
    const workspaceId = 10;
    const subproblemId = 20;
    const state = {
      blob: 'with values'
    };
    var queryInputValues = [workspaceId, subproblemId, 'Default', state];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should create a scenario and return the id', function(done) {
      const createdId = 32;
      var queryResult = {
        rows: [{ id: createdId }]
      };
      var expectedResult1 = workspaceId;
      var expectedResult2 = createdId;
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryTwoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult1, 
        expectedResult2, done);
      scenarioRepository.create(workspaceId, subproblemId, state, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.create(workspaceId, subproblemId, state, callback);
    });
  });
});

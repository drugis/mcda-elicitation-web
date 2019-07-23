'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function() {
    console.log('query being called');
  }
};
var workspaceRepository = require('../node-backend/workspaceRepository')(dbStub);

describe('the workspace repository', function() {
  var expectedError = 'error';
  var workspaceId = 1;

  describe('get', function() {
    var query;
    var expectedQuery = 'SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    var queryInputValues = [workspaceId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should get the workspace and call the callback with the result', function(done) {
      var queryResult = {
        rows: [{}]
      };
      var expectedResult = {};
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.get(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.get(workspaceId, callback);
    });
  });

  describe('create', function() {
    var query;
    var expectedQuery = 'INSERT INTO workspace (owner, title, problem) VALUES ($1, $2, $3) RETURNING id';
    var owner = 14;
    var title = 'title';
    var problem = {};
    var queryInputValues = [owner, title, problem];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should create a workspace and return the id', function(done) {
      var queryResult = {
        rows: [{ id: workspaceId }]
      };
      var expectedResult = workspaceId;
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.create(owner, title, problem, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.create(owner, title, problem, callback);
    });
  });

  describe('setDefaultSubProblem', function() {
    var query;
    var expectedQuery = 'UPDATE workspace SET defaultsubproblemId = $1 WHERE id = $2';
    var subProblemId = 123;
    var queryInputValues = [subProblemId, workspaceId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should set the default sub problem for the workspace', function(done) {
      var expectedResult = workspaceId;
      query.onCall(0).yields(null);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.setDefaultSubProblem(workspaceId, subProblemId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.setDefaultSubProblem(workspaceId, subProblemId, callback);
    });
  });

  describe('setDefaultScenario', function() {
    var query;
    var expectedQuery = 'UPDATE workspace SET defaultScenarioId = $1 WHERE id = $2';
    var scenarioId = 123;
    var queryInputValues = [scenarioId, workspaceId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should set the default sub problem for the workspace', function(done) {
      var expectedResult = workspaceId;
      query.onCall(0).yields(null);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.setDefaultScenario(workspaceId, scenarioId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.setDefaultScenario(workspaceId, scenarioId, callback);
    });
  });

  describe('getWorkspaceInfo', () => {
    var query;
    const expectedQuery = 'SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    const queryInputValues = [workspaceId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should retrieve the workspace information', function(done) {
      const queryResult = {
        rows: [{ id: workspaceId }]
      };
      var expectedResult = queryResult.rows[0];
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.getWorkspaceInfo(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.getWorkspaceInfo(workspaceId, callback);
    });
  });

});

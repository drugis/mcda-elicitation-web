'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function() {
    console.log('query being called');
  }
};
var workspaceRepository = require('../node-backend/workspaceRepository')(dbStub);
var query;

function initDBStub() {
  beforeEach(() => {
    query = sinon.stub(dbStub, 'query');
  });
  afterEach(() => {
    query.restore();
  });
}

describe('the workspace repository', function() {
  const expectedError = 'error';
  const workspaceId = 1;
  const title = 'title';
  const problem = {};
  const ownerId = 14;


  describe('get', function() {
    const expectedQuery = 'SELECT id, owner, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    const queryInputValues = [workspaceId];

    initDBStub();

    it('should get the workspace and call the callback with the result', function(done) {
      const queryResult = {
        rows: [{}]
      };
      const expectedResult = queryResult.rows[0];
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.get(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      const queryResult = {
        rows: []
      };
      const expectedEmptyResultError = {
        message: 'No workspace with ID ' + workspaceId + ' found.',
        statusCode: 404
      };
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedEmptyResultError, done);
      workspaceRepository.get(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.get(workspaceId, callback);
    });
  });

  describe('create', function() {
    const expectedQuery = 'INSERT INTO workspace (owner, title, problem) VALUES ($1, $2, $3) RETURNING id';
    const queryInputValues = [ownerId, title, problem];

    initDBStub();

    it('should create a workspace and return the id', function(done) {
      const queryResult = {
        rows: [{ id: workspaceId }]
      };
      const expectedResult = queryResult.rows[0].id;
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.create(ownerId, title, problem, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.create(ownerId, title, problem, callback);
    });
  });

  describe('setDefaultSubProblem', function() {
    const expectedQuery = 'UPDATE workspace SET defaultSubproblemId = $1 WHERE id = $2';
    const subProblemId = 123;
    const queryInputValues = [subProblemId, workspaceId];

    initDBStub();

    it('should set the default sub problem for the workspace', function(done) {
      query.onCall(0).yields(null);
      const callback = testUtil.createQueryNoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, done);
      workspaceRepository.setDefaultSubProblem(workspaceId, subProblemId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.setDefaultSubProblem(workspaceId, subProblemId, callback);
    });
  });

  describe('getDefaultSubProblem', function() {
    const expectedQuery = 'SELECT defaultSubproblemId FROM workspace WHERE id = $1';
    const expectedResult = [123];
    const queryInputValues = [workspaceId];

    initDBStub();

    it('should get the default subproblem for the workspace', function(done) {
      query.onCall(0).yields(null, expectedResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.getDefaultSubproblem(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.getDefaultSubproblem(workspaceId, callback);
    });
  });

  describe('setDefaultScenario', function() {
    const expectedQuery = 'UPDATE workspace SET defaultScenarioId = $1 WHERE id = $2';
    const scenarioId = 123;
    const queryInputValues = [scenarioId, workspaceId];

    initDBStub();

    it('should set the default sub problem for the workspace', function(done) {
      query.onCall(0).yields(null);
      const callback = testUtil.createQueryNoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, done);
      workspaceRepository.setDefaultScenario(workspaceId, scenarioId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.setDefaultScenario(workspaceId, scenarioId, callback);
    });
  });

  describe('getDefaultScenarioId', function() {
    const expectedQuery = 'SELECT defaultScenarioId FROM workspace WHERE id = $1';
    const expectedResult = 123;
    const queryResult = {
      rows: [{
        defaultscenarioid: expectedResult
      }]
    };
    const queryInputValues = [workspaceId];

    initDBStub();

    it('should get the default scenario for the workspace', function(done) {
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.getDefaultScenarioId(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.getDefaultScenarioId(workspaceId, callback);
    });
  });

  describe('getWorkspaceInfo', () => {
    const expectedQuery = 'SELECT id, owner, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    const queryInputValues = [workspaceId];

    initDBStub();

    it('should retrieve the workspace information', function(done) {
      const queryResult = {
        rows: [{ id: workspaceId }]
      };
      const expectedResult = queryResult.rows[0];
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.getWorkspaceInfo(workspaceId, callback);
    });

    it('should call the callback with an error if result is empty', function(done) {
      const queryResult = {
        rows: []
      };
      const expectedEmptyResultError = 'No workspace with ID ' + workspaceId + ' found.';
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedEmptyResultError, done);
      workspaceRepository.getWorkspaceInfo(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.getWorkspaceInfo(workspaceId, callback);
    });
  });

  describe('update', function() {
    initDBStub();

    it('should update the workspace', function(done) {
      const expectedQuery = 'UPDATE workspace SET title = $1, problem = $2 WHERE id = $3';
      const queryInputValues = [title, problem, workspaceId];
      const expectedResult = undefined;
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      query.onCall(0).yields(null);
      workspaceRepository.update(title, problem, workspaceId, callback);
    });
  });

  describe('delete', () => {
    initDBStub();

    it('should delete the workspace', (done) => {
      const expectedQuery = 'DELETE FROM workspace WHERE id=$1';
      const queryInputValues = [workspaceId];
      const expectedResult = undefined;
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      query.onCall(0).yields(null);
      workspaceRepository.delete(workspaceId, callback);

    });
  });

  describe('query', function() {
    initDBStub();

    const expectedQuery = 'SELECT id, owner, title, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM Workspace WHERE owner = $1';
    const queryInputValues = [ownerId];

    it('should query all in-progress workspaces for the user', function(done) {
      const queryResult = {
        rows: []
      };
      const expectedResult = queryResult.rows;
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.query(ownerId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceRepository.query(ownerId, callback);
    });
  });

});

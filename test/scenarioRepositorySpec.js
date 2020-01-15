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
    const expectedQuery = 'INSERT INTO scenario (workspace, subProblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id';
    const workspaceId = 10;
    const subproblemId = 20;
    const title = 'title';
    const state = {
      blob: 'with values'
    };
    const queryInputValues = [workspaceId, subproblemId, title, state];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should create a scenario and call the callback with results', function(done) {
      const createdId = 32;
      const queryResult = {
        rows: [{ id: createdId }]
      };
      const expectedResult = queryResult;
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      scenarioRepository.create(workspaceId, subproblemId, title, state, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.create(workspaceId, subproblemId, title, state, callback);
    });
  });

  describe('query', function() {
    var query;
    const expectedQuery = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1';
    const workspaceId = 10;
    const queryInputValues = [workspaceId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should get all scenarios for the workspace and call the callback with results', function(done) {
      const queryResult = {
        rows: [{
          id: 10,
          title: 'title',
          state: {},
          subProblemId: 11,
          workspaceId: workspaceId
        }]
      };
      query.onCall(0).yields(null, queryResult);
      const expectedResult = queryResult;
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      scenarioRepository.query(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.query(workspaceId, callback);
    });
  });

  describe('queryForSubProblem', function() {
    var query;
    const expectedQuery = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1 AND subProblemId = $2';
    const workspaceId = 10;
    const subproblemId = 123;
    const queryInputValues = [workspaceId, subproblemId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should get all scenarios for a certain subproblem and call the callback with results', function(done) {
      const queryResult = {
        rows: [{
          id: 10,
          title: 'title',
          state: {},
          subProblemId: 11,
          workspaceId: workspaceId
        }]
      };
      query.onCall(0).yields(null, queryResult);
      const expectedResult = queryResult;
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      scenarioRepository.queryForSubProblem(workspaceId, subproblemId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.queryForSubProblem(workspaceId, subproblemId, callback);
    });
  });

  describe('get', function() {
    var query;
    const expectedQuery = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE id = $1';
    const scenarioId = 10;
    const queryInputValues = [scenarioId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should get a scenario and call the callback with results', function(done) {
      const queryResult = {
        rows: [{
          id: 10,
          title: 'title',
          state: {},
          subProblemId: 11,
          workspaceId: 1233
        }]
      };
      query.onCall(0).yields(null, queryResult);
      const expectedResult = queryResult;
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      scenarioRepository.get(scenarioId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.get(scenarioId, callback);
    });
  });

  describe('update', function() {
    var query;
    const expectedQuery = 'UPDATE scenario SET state = $1, title = $2 WHERE id = $3';
    const scenarioId = 10;
    const title = 'title';
    const state = {
      problem: {},
      prefs: [],
      legend: {},
      uncertaintyOptions: {}
    };
    const queryInputValues = [state, title, scenarioId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should update the scenario and call the callback with results', function(done) {
      query.onCall(0).yields(null);
      const callback = testUtil.createQueryNoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, done);
      scenarioRepository.update(state, title, scenarioId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.update(state, title, scenarioId, callback);
    });
  });

  describe('delete', function() {
    var query;
    const expectedQuery = 'DELETE FROM scenario WHERE id = $1';
    const scenarioId = 37;
    const queryInputValues = [scenarioId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should delete the subproblem', function(done) {
      query.onCall(0).yields(null);
      var callback = testUtil.createQueryNoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, done);
      scenarioRepository.delete(scenarioId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.delete(scenarioId, callback);
    });
  });

  describe('countScenariosForSubproblem', function() {
    var query;
    const expectedQuery = 'SELECT COUNT(*) FROM scenario WHERE subproblemid = $1';
    const subproblemId = 37;
    const queryInputValues = [subproblemId];

    beforeEach(function() {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function() {
      query.restore();
    });

    it('should count the scenarios for the subproblem', function(done) {
      query.onCall(0).yields(null);
      var callback = testUtil.createQueryNoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, done);
      scenarioRepository.countScenariosForSubproblem(subproblemId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      scenarioRepository.countScenariosForSubproblem(subproblemId, callback);
    });
  });
});

'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function() {
    console.log('query being called');
  }
};
var inProgressWorkspaceRepository = require('../node-backend/inProgressWorkspaceRepository')(dbStub);
const ownerId = 14;
var query;

function initDBStub() {
  beforeEach(() => {
    query = sinon.stub(dbStub, 'query');
  });
  afterEach(() => {
    query.restore();
  });
}

describe('the inProgressWorkspace repository', function() {
  var inProgressWorkspaceId = 1;
  var state = {};
  var expectedError = 'error';

  describe('get', function() {
    initDBStub();

    var expectedQuery = 'SELECT id, owner, state FROM inProgressWorkspace WHERE id = $1';
    var queryInputValues = [inProgressWorkspaceId];

    it('should get the inProgressWorkspace and call the callback with the result', function(done) {
      var queryResult = {
        rows: [{}]
      };
      var expectedResult = queryResult.rows[0];
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      inProgressWorkspaceRepository.get(inProgressWorkspaceId, callback);
    });

    it('should call the callback with an error if result is empty', function(done) {
      var queryResult = {
        rows: []
      };
      var expectedEmptyResultError = {
        message: 'In progress workspace with ID 1 not found.',
        statusCode: 404
      };
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedEmptyResultError, done);
      inProgressWorkspaceRepository.get(inProgressWorkspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      inProgressWorkspaceRepository.get(inProgressWorkspaceId, callback);
    });
  });

  describe('create', function() {
    initDBStub();

    var expectedQuery = 'INSERT INTO inProgressWorkspace (owner, state) VALUES ($1, $2) RETURNING id';
    var queryInputValues = [ownerId, state];

    it('should create a inProgressWorkspace and return the id', function(done) {
      var queryResult = {
        rows: [{
          id: 123
        }]
      };
      var expectedResult = queryResult.rows[0];
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      inProgressWorkspaceRepository.create(ownerId, state, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      inProgressWorkspaceRepository.create(ownerId, state, callback);
    });
  });

  describe('update', function() {
    initDBStub();
    const expectedQuery = 'UPDATE inProgressWorkspace SET state = $1 WHERE id = $2';
    const queryInputValues = [state, inProgressWorkspaceId];

    it('should update the inProgressWorkspace', function(done) {
      const callback = testUtil.createQueryNoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, done);
      query.onCall(0).yields(null);
      inProgressWorkspaceRepository.update(state, inProgressWorkspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      inProgressWorkspaceRepository.update(state, inProgressWorkspaceId, callback);
    });
  });

  describe('delete', () => {
    initDBStub();

    const expectedQuery = 'DELETE FROM inProgressWorkspace WHERE id=$1';
    const queryInputValues = [inProgressWorkspaceId];

    it('should delete the inProgressWorkspace', (done) => {
      const callback = testUtil.createQueryNoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, done);
      query.onCall(0).yields(null);
      inProgressWorkspaceRepository.delete(inProgressWorkspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      inProgressWorkspaceRepository.delete(inProgressWorkspaceId, callback);
    });
  });

  describe('query', function() {
    initDBStub();

    const expectedQuery = 'SELECT id, owner, state FROM inProgressWorkspace WHERE owner = $1';
    const queryInputValues = [ownerId];

    it('should query all in-progress workspaces for the user', function(done) {
      const queryResult = {
        rows: []
      };
      const expectedResult = queryResult.rows;
      query.onCall(0).yields(null, queryResult);
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      inProgressWorkspaceRepository.query(ownerId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      const callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      inProgressWorkspaceRepository.query(ownerId, callback);
    });
  });
});

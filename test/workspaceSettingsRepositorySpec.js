'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function() {
    console.log('query being called');
  }
};
var workspaceSettingsRepository = require('../node-backend/workspaceSettingsRepository')(dbStub);
var query;

function initDBStub() {
  beforeEach(() => {
    query = sinon.stub(dbStub, 'query');
  });
  afterEach(() => {
    query.restore();
  });
}

describe('the workspace settings repository', function() {
  var expectedError = 'error';
  var workspaceId = 1;

  describe('get', function() {
    initDBStub();

    var expectedQuery = 'SELECT settings FROM workspaceSettings WHERE workspaceId = $1';
    var queryInputValues = [workspaceId];

    it('should get the settings and call the callback with the result', function(done) {
      var queryResult = {
        rows: [{
          settings: {}
        }]
      };
      var expectedResult = queryResult.rows[0].settings;
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceSettingsRepository.get(workspaceId, callback);
    });

    it('should return an empty object if there are no settings', function(done) {
      var queryResult = {
        rows: []
      };
      var expectedResult = {};
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceSettingsRepository.get(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceSettingsRepository.get(workspaceId, callback);
    });
  });

  describe('put', function() {
    initDBStub();
    const workspaceSettings = {};
    const expectedQuery = 'INSERT INTO workspaceSettings (workspaceid, settings) VALUES ($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET settings=$2';
    const queryInputValues = [workspaceId, workspaceSettings];

    it('should put the workspace settings', function(done) {
      const expectedResult = undefined;
      const callback = testUtil.createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done);
      query.onCall(0).yields(null);
      workspaceSettingsRepository.put(workspaceId, workspaceSettings, callback);
    });

    it('should call the callback with only an error', function(done) {
      query.onCall(0).yields(expectedError);
      var callback = testUtil.createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done);
      workspaceSettingsRepository.put(workspaceId,workspaceSettings, callback);
    });
  });
});

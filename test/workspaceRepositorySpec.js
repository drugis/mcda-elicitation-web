'use strict';
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var dbStub = {
  query: function() {
    console.log('query being called');
  }
};
var workspaceRepository = require('../node-backend/workspaceRepository')(dbStub);

describe('the workspace repository', function() {
  var expectedError = 'error';
  var workspaceId = 1;

  function succesCallback(query, expectedQuery, queryInputValues, expectedResult, done) {
    return function(error, result) {
      sinon.assert.calledWith(query, expectedQuery, queryInputValues);
      expect(error).to.be.null;
      expect(result).to.deep.equal(expectedResult);
      done();
    };
  }

  function errorCallback(query, expectedQuery, queryInputValues, done) {
    return function(error) {
      sinon.assert.calledWith(query, expectedQuery, queryInputValues);
      expect(error).to.equal(expectedError);
      done();
    };
  }

  describe('get', function() {
    var query;
    var expectedQuery = 'SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';

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
      var queryInputValues = [workspaceId];
      query.onCall(0).yields(null, queryResult);
      var callback = succesCallback(query, expectedQuery, queryInputValues, expectedResult, done);
      workspaceRepository.get(workspaceId, callback);
    });

    it('should call the callback with only an error', function(done){
      query.onCall(0).yields(expectedError);
      var queryInputValues = [workspaceId];
      var callback = errorCallback(query, expectedQuery, queryInputValues, done);
      workspaceRepository.get(workspaceId, callback);
    });
  });
});

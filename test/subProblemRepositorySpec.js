'use strict';
var sinon = require('sinon');
var testUtil = require('./testUtil');

var dbStub = {
  query: function () {
    console.log('query being called');
  }
};
var subProblemRepository = require('../node-backend/subProblemRepository')(
  dbStub
);

describe('the subproblem repository', function () {
  var expectedError = 'some expected error';
  const createdId = 32;
  var queryResult = {
    rows: [{id: createdId}]
  };
  describe('create', function () {
    var query;
    const expectedQuery =
      'INSERT INTO subproblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id';
    const workspaceId = 10;
    const definition = {
      blob: 'with values'
    };
    var title = 'title';
    var queryInputValues = [workspaceId, title, definition];

    beforeEach(function () {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function () {
      query.restore();
    });

    it('should create a subproblem and return the id', function (done) {
      var expectedResult = queryResult.rows[0].id;
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        expectedResult,
        done
      );
      subProblemRepository.create(
        {query: query},
        workspaceId,
        title,
        definition,
        callback
      );
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
      subProblemRepository.create(
        {query: query},
        workspaceId,
        title,
        definition,
        callback
      );
    });
  });

  describe('get', function () {
    var query;
    const expectedQuery =
      'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1 AND id = $2';
    const workspaceId = 10;
    const subproblemId = 123;
    const queryInputValues = [workspaceId, subproblemId];

    beforeEach(function () {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function () {
      query.restore();
    });

    it('should get the subproblem and return the id', function (done) {
      var expectedResult = queryResult.rows[0];
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        expectedResult,
        done
      );
      subProblemRepository.get(workspaceId, subproblemId, callback);
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
      subProblemRepository.get(workspaceId, subproblemId, callback);
    });
  });

  describe('query', function () {
    var query;
    const expectedQuery =
      'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1';
    const workspaceId = 10;
    const queryInputValues = [workspaceId];

    beforeEach(function () {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function () {
      query.restore();
    });

    it('should get the subproblems for the workspace', function (done) {
      var expectedResult = queryResult.rows;
      query.onCall(0).yields(null, queryResult);
      var callback = testUtil.createQueryCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        expectedResult,
        done
      );
      subProblemRepository.query(workspaceId, callback);
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
      subProblemRepository.query(workspaceId, callback);
    });
  });

  describe('update', function () {
    var query;
    const expectedQuery =
      'UPDATE subproblem SET definition = $1, title = $2 WHERE id = $3';
    const definition = {};
    const title = 'title';
    const subproblemId = 10;
    const queryInputValues = [definition, title, subproblemId];

    beforeEach(function () {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function () {
      query.restore();
    });

    it('should update the subproblem', function (done) {
      query.onCall(0).yields(null);
      var callback = testUtil.createQueryNoArgumentCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        done
      );
      subProblemRepository.update(definition, title, subproblemId, callback);
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
      subProblemRepository.update(definition, title, subproblemId, callback);
    });
  });

  describe('delete', function () {
    var query;
    const expectedQuery = 'DELETE FROM subproblem WHERE id = $1';
    const subproblemId = 37;
    const queryInputValues = [subproblemId];

    beforeEach(function () {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function () {
      query.restore();
    });

    it('should delete the subproblem', function (done) {
      query.onCall(0).yields(null);
      var callback = testUtil.createQueryNoArgumentCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        done
      );
      subProblemRepository.delete({query: query}, subproblemId, callback);
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
      subProblemRepository.delete({query: query}, subproblemId, callback);
    });
  });

  describe('getSubproblemIds', function () {
    var query;
    const expectedQuery = 'SELECT id FROM subproblem WHERE workspaceid = $1';
    const workspaceId = 37;
    const queryInputValues = [workspaceId];
    const queryResult = {rows: [{id: 123}]};

    beforeEach(function () {
      query = sinon.stub(dbStub, 'query');
    });

    afterEach(function () {
      query.restore();
    });

    it('should getSubproblemIds the subproblem', function (done) {
      query.onCall(0).yields(null, queryResult);
      const expectedResult = queryResult.rows;
      var callback = testUtil.createQueryCallbackWithTests(
        query,
        expectedQuery,
        queryInputValues,
        expectedResult,
        done
      );
      subProblemRepository.getSubproblemIds(workspaceId, callback);
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
      subProblemRepository.getSubproblemIds(workspaceId, callback);
    });
  });
});

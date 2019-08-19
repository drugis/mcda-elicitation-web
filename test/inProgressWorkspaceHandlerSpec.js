'use strict';
const sinon = require('sinon');
const testUtil = require('./testUtil');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var repoStub = {
  create: () => { },
  update: () => { },
  get: () => { },
  query: () => { },
  delete: () => { }
};
const dbArgumement = {
  './inProgressWorkspaceRepository': () => {
    return repoStub;
  }
};
const inProgressWorkspaceHandler = proxyquire(
  '../node-backend/inProgressWorkspaceHandler',
  dbArgumement)({});


describe('the in progress workspace handler', () => {
  const error = 'error';

  describe('create', () => {
    var create;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      create = sinon.stub(repoStub, 'create');
    });

    afterEach(() => {
      create.restore();
    });

    const userId = 132;
    const problem = { prop: 'val' };
    const request = {
      user: {
        id: userId
      },
      body: problem
    };
    const next = chai.spy();

    it('should call the in progress workspace repository with the correct arguments', () => {
      const createdId = 321;
      const result = {
        rows: [{
          id: createdId
        }]
      };
      create.onCall(0).yields(null, result);

      inProgressWorkspaceHandler.create(request, response, next);

      sinon.assert.calledWith(create, userId, problem);
      expect(response.json).to.have.been.called.with({ id: createdId });
    });

    it('should not call reponse.json if there\'s an error', function() {
      create.onCall(0).yields(error, null);
      inProgressWorkspaceHandler.create(request, response, next);
      sinon.assert.calledWith(create, userId, problem);
      expect(response.json).not.to.have.been.called();
      expect(next).to.have.been.called.with({
        statusCode: 500,
        message: error
      });
    });
  });

  describe('update', () => {
    var update;
    var response = {};


    beforeEach(() => {
      response.end = chai.spy();
      update = sinon.stub(repoStub, 'update');
    });

    afterEach(() => {
      update.restore();
    });

    const problem = { prop: 'val' };
    const problemId = 1;
    const request = {
      body: problem,
      params: {
        id: problemId
      }
    };
    const next = chai.spy();

    it('should call the in progress workspace repository with the correct arguments', () => {
      update.onCall(0).yields(null);

      inProgressWorkspaceHandler.update(request, response, next);

      sinon.assert.calledWith(update, problem, problemId);
      expect(response.end).to.have.been.called();
    });

    it('should not call reponse.end if there\'s an error', function() {
      update.onCall(0).yields(error, null);
      inProgressWorkspaceHandler.update(request, response, next);
      sinon.assert.calledWith(update, problem, problemId);
      expect(response.end).not.to.have.been.called();
      expect(next).to.have.been.called.with({
        statusCode: 500,
        message: error
      });
    });
  });

  describe('delete', () => {
    var del;
    var response = {};


    beforeEach(() => {
      response.end = chai.spy();
      del = sinon.stub(repoStub, 'delete');
    });

    afterEach(() => {
      del.restore();
    });

    const problemId = 1;
    const request = {
      params: {
        id: problemId
      }
    };
    const next = chai.spy();

    it('should call the in progress workspace repository with the correct arguments', () => {
      del.onCall(0).yields(null);

      inProgressWorkspaceHandler.delete(request, response, next);

      sinon.assert.calledWith(del, problemId);
      expect(response.end).to.have.been.called();
    });

    it('should not call reponse.end if there\'s an error', function() {
      del.onCall(0).yields(error, null);
      inProgressWorkspaceHandler.delete(request, response, next);
      sinon.assert.calledWith(del, problemId);
      expect(response.end).not.to.have.been.called();
      expect(next).to.have.been.called.with({
        statusCode: 500,
        message: error
      });
    });
  });

  describe('get', () => {
    var get;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      get = sinon.stub(repoStub, 'get');
    });

    afterEach(() => {
      get.restore();
    });

    const problemId = 1;
    const request = {
      params: {
        id: problemId
      }
    };
    const next = chai.spy();

    it('should call the in progress workspace repository with the correct arguments', () => {
      const workspaceId = 321;
      const result = {
        rows: [{
          id: workspaceId
        }]
      };
      get.onCall(0).yields(null, result);

      inProgressWorkspaceHandler.get(request, response, next);

      sinon.assert.calledWith(get, problemId);
      expect(response.json).to.have.been.called.with(result.rows[0]);
    });

    it('should not call reponse.json if there\'s an error', function() {
      get.onCall(0).yields(error, null);
      inProgressWorkspaceHandler.get(request, response, next);
      sinon.assert.calledWith(get, problemId);
      expect(response.json).not.to.have.been.called();
      expect(next).to.have.been.called.with({
        statusCode: 500,
        message: error
      });
    });
  });

  describe('query', () => {
    var query;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      query = sinon.stub(repoStub, 'query');
    });

    afterEach(() => {
      query.restore();
    });

    const userId = 132;
    const request = {
      user: {
        id: userId
      }
    };
    const next = chai.spy();

    it('should call the in progress workspace repository with the correct arguments', () => {
      const workspaceId = 321;
      const result = {
        rows: [{
          id: workspaceId
        }]
      };
      query.onCall(0).yields(null, result);

      inProgressWorkspaceHandler.query(request, response, next);

      sinon.assert.calledWith(query, userId);
      expect(response.json).to.have.been.called.with(result.rows);
    });

    it('should not call reponse.json if there\'s an error', function() {
      query.onCall(0).yields(error, null);
      inProgressWorkspaceHandler.query(request, response, next);
      sinon.assert.calledWith(query, userId);
      expect(response.json).not.to.have.been.called();
      expect(next).to.have.been.called.with({
        statusCode: 500,
        message: error
      });
    });
  });
});

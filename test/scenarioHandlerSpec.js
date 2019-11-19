'use strict';
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var repoStub = {
  query: () => { },
  queryForSubProblem: () => { },
  get: () => { },
  create: () => { },
  update: () => { },
};

const dbArgumement = {
  './scenarioRepository': () => {
    return repoStub;
  }
};

const scenarioHandler = proxyquire(
  '../node-backend/scenarioHandler',
  dbArgumement)({});

describe('the in scenario handler', () => {
  const error = 'error';

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

    const workspaceId = 10;
    const request = {
      params: {
        workspaceId: workspaceId
      }
    };
    const next = chai.spy();

    it('should call the in scenario repository with the correct arguments', () => {
      const result = {
        rows: []
      };
      query.onCall(0).yields(null, result);

      scenarioHandler.query(request, response, next);
      sinon.assert.calledWith(query, workspaceId);
      expect(next).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows);
    });

    it('should not call reponse.json if there\'s an error', function() {
      query.onCall(0).yields(error, null);
      scenarioHandler.query(request, response, next);
      sinon.assert.calledWith(query, workspaceId);
      expect(response.json).not.to.have.been.called();
      expect(next).to.have.been.called.with(error);
    });
  });

  describe('queryForSubProblem', () => {
    var queryForSubProblem;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      queryForSubProblem = sinon.stub(repoStub, 'queryForSubProblem');
    });

    afterEach(() => {
      queryForSubProblem.restore();
    });

    const workspaceId = 10;
    const subproblemId = 123;
    const request = {
      params: {
        workspaceId: workspaceId,
        subProblemId: subproblemId
      }
    };
    const next = chai.spy();

    it('should call the in scenario repository with the correct arguments', () => {
      const result = {
        rows: []
      };
      queryForSubProblem.onCall(0).yields(null, result);

      scenarioHandler.queryForSubProblem(request, response, next);
      sinon.assert.calledWith(queryForSubProblem, workspaceId, subproblemId);
      expect(next).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows);
    });

    it('should not call reponse.json if there\'s an error', function() {
      queryForSubProblem.onCall(0).yields(error, null);
      scenarioHandler.queryForSubProblem(request, response, next);
      sinon.assert.calledWith(queryForSubProblem, workspaceId, subproblemId);
      expect(response.json).not.to.have.been.called();
      expect(next).to.have.been.called.with(error);
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

    const scenarioId = 10;
    const request = {
      params: {
        id: scenarioId
      }
    };
    const next = chai.spy();

    it('should call the in scenario repository with the correct arguments', () => {
      const result = {
        rows: [{}]
      };
      get.onCall(0).yields(null, result);

      scenarioHandler.get(request, response, next);
      sinon.assert.calledWith(get, scenarioId);
      expect(next).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows[0]);
    });

    it('should not call reponse.json if there\'s an error', function() {
      get.onCall(0).yields(error, null);
      scenarioHandler.get(request, response, next);
      sinon.assert.calledWith(get, scenarioId);
      expect(response.json).not.to.have.been.called();
      expect(next).to.have.been.called.with(error);
    });
  });

  describe('create', () => {
    var create;
    var response = {};

    beforeEach(() => {
      response.status = chai.spy();
      response.json = chai.spy();
      create = sinon.stub(repoStub, 'create');
    });

    afterEach(() => {
      create.restore();
    });

    const workspaceId = 10;
    const subproblemId = 1231;
    const title = 'title';
    const state = {
      problem: {},
      prefs: []
    };
    const request = {
      params: {
        workspaceId: workspaceId,
        subProblemId: subproblemId
      },
      body: {
        title: title,
        state: state
      }
    };
    const next = chai.spy();

    it('should call the in scenario repository with the correct arguments', () => {
      const result = {
        rows: [{}]
      };
      create.onCall(0).yields(null, result);

      scenarioHandler.create(request, response, next);
      sinon.assert.calledWith(create, workspaceId, subproblemId, title, state);
      expect(next).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows[0]);
      expect(response.status).to.have.been.called.with(201);
    });

    it('should not call reponse.json if there\'s an error', function() {
      create.onCall(0).yields(error, null);
      scenarioHandler.create(request, response, next);
      sinon.assert.calledWith(create, workspaceId, subproblemId, title, state);
      expect(response.json).not.to.have.been.called();
      expect(response.status).to.not.have.been.called();
      expect(next).to.have.been.called.with(error);
    });
  });

  describe('update', () => {
    var update;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      update = sinon.stub(repoStub, 'update');
    });

    afterEach(() => {
      update.restore();
    });

    const scenarioId = 10;
    const title = 'title';
    const state = {};
    const request = {
      body: {
        state: state,
        title: title,
        id: scenarioId
      }
    };
    const next = chai.spy();

    it('should call the in scenario repository with the correct arguments', () => {
      const result = {
        rows: [{}]
      };
      update.onCall(0).yields(null, result);

      scenarioHandler.update(request, response, next);
      sinon.assert.calledWith(update, state, title, scenarioId);
      expect(next).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(request.body);
    });

    it('should not call reponse.json if there\'s an error', function() {
      update.onCall(0).yields(error, null);
      scenarioHandler.update(request, response, next);
      sinon.assert.calledWith(update, state, title, scenarioId);
      expect(response.json).not.to.have.been.called();
      expect(next).to.have.been.called.with(error);
    });
  });
});

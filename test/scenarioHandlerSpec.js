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
  delete: () => { },
  getScenarioIdsForSubproblem: () => { }
};
var workspaceRepoStub = {
  getDefaultScenarioId: () => { },
  setDefaultScenario: () => { }
};
const utilStub = chai.spy();

const dbArgumement = {
  './scenarioRepository': () => {
    return repoStub;
  },
  './workspaceRepository': () => {
    return workspaceRepoStub;
  },
  './util': utilStub
};

const db = {
  runInTransaction: (transactions, callback) => {
    transactions(undefined, callback);
  }
};

const scenarioHandler = proxyquire(
  '../node-backend/scenarioHandler',
  dbArgumement)(db);

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

  describe('delete', function() {
    var deleteStub;
    var getScenarioIdsForSubproblem;
    var getDefaultScenarioId;
    var setDefaultScenario;
    const scenarioId = 37;
    const otherScenarioId = 100;
    const subproblemId = 42;
    const workspaceId = 50;
    const request = {
      params: {
        id: scenarioId + '',
        subproblemId: subproblemId,
        workspaceId: workspaceId
      }
    };
    const scenarioIdsForSubproblem = [{
      id: scenarioId
    }, {
      id: otherScenarioId
    }];

    beforeEach(() => {
      deleteStub = sinon.stub(repoStub, 'delete');
      getScenarioIdsForSubproblem = sinon.stub(repoStub, 'getScenarioIdsForSubproblem');
      utilStub.handleError = chai.spy();
      getDefaultScenarioId = sinon.stub(workspaceRepoStub, 'getDefaultScenarioId');
      setDefaultScenario = sinon.stub(workspaceRepoStub, 'setDefaultScenario');
    });

    afterEach(() => {
      deleteStub.restore();
      getScenarioIdsForSubproblem.restore();
      getDefaultScenarioId.restore();
      setDefaultScenario.restore();
    });

    it('should call reponse.sendstatus with ok when deleting non-default scenario', (done) => {
      const next = chai.spy();
      const expectations = function(status) {
        expect(next).to.have.not.been.called();
        expect(status).to.equal(200);
        done();
      };
      const response = {
        sendStatus: expectations,
      };
      getScenarioIdsForSubproblem.onCall(0).yields(null, scenarioIdsForSubproblem);
      getDefaultScenarioId.onCall(0).yields(null, { rows: [{ defaultscenarioid: otherScenarioId }] });
      deleteStub.onCall(0).yields(null);

      scenarioHandler.delete(request, response, next);
      sinon.assert.calledWith(getScenarioIdsForSubproblem, subproblemId);
      sinon.assert.calledWith(getDefaultScenarioId, workspaceId);
      sinon.assert.calledWith(deleteStub, scenarioId);
      expect(utilStub.handleError).not.to.have.been.called();
    });

    it('should call reponse.sendstatus with ok when deleting the default scenario', (done) => {
      const next = chai.spy();
      const expectations = function(status) {
        expect(next).to.have.not.been.called();
        expect(status).to.equal(200);
        done();
      };
      const response = {
        sendStatus: expectations,
      };
      getScenarioIdsForSubproblem.onCall(0).yields(null, scenarioIdsForSubproblem);
      getDefaultScenarioId.onCall(0).yields(null, { rows: [{ defaultscenarioid: scenarioId }] });
      setDefaultScenario.onCall(0).yields(null, null);
      deleteStub.onCall(0).yields(null);
      scenarioHandler.delete(request, response, next);
      sinon.assert.calledWith(getScenarioIdsForSubproblem, subproblemId);
      sinon.assert.calledWith(getDefaultScenarioId, workspaceId);
      sinon.assert.calledWith(setDefaultScenario, workspaceId, otherScenarioId);
      sinon.assert.calledWith(deleteStub, scenarioId);
      expect(utilStub.handleError).not.to.have.been.called();
    });

    it('should call util.handleError if there is only one scenario', function() {
      const notEnoughError = 'Cannot delete the only scenario for subproblem';
      getScenarioIdsForSubproblem.onCall(0).yields(null, [{ id: scenarioId }]);
      scenarioHandler.delete(request, undefined, undefined);
      sinon.assert.calledWith(getScenarioIdsForSubproblem, subproblemId);
      expect(utilStub.handleError).to.have.been.called.with(notEnoughError);
    });

    it('should call util.handleError if there\'s an error deleting', function() {
      getScenarioIdsForSubproblem.onCall(0).yields(null, scenarioIdsForSubproblem);
      getDefaultScenarioId.onCall(0).yields(null, { rows: [{ defaultscenarioid: otherScenarioId }] });
      deleteStub.onCall(0).yields(error);
      scenarioHandler.delete(request, undefined, undefined);
      sinon.assert.calledWith(getScenarioIdsForSubproblem, subproblemId);
      sinon.assert.calledWith(getDefaultScenarioId, workspaceId);
      sinon.assert.calledWith(deleteStub, scenarioId + '');
      expect(utilStub.handleError).to.have.been.called();
    });

    it('should call util.handleError if there\'s an error getting scenarios for the subproblem', function() {
      getScenarioIdsForSubproblem.onCall(0).yields(error);
      scenarioHandler.delete(request, undefined, undefined);
      sinon.assert.calledWith(getScenarioIdsForSubproblem, subproblemId);
      expect(utilStub.handleError).to.have.been.called();
    });

    it('should call util.handleError if there\'s an error getting the default scenario', function() {
      getScenarioIdsForSubproblem.onCall(0).yields(null, scenarioIdsForSubproblem);
      getDefaultScenarioId.onCall(0).yields(error);
      scenarioHandler.delete(request, undefined, undefined);
      sinon.assert.calledWith(getScenarioIdsForSubproblem, subproblemId);
      sinon.assert.calledWith(getDefaultScenarioId, workspaceId);
      expect(utilStub.handleError).to.have.been.called();
    });

    it('should call util.handleError if there\'s an error setting the default scenario', function() {
      getScenarioIdsForSubproblem.onCall(0).yields(null, scenarioIdsForSubproblem);
      getDefaultScenarioId.onCall(0).yields(null, scenarioId);
      setDefaultScenario.onCall(0).yields(error);

      scenarioHandler.delete(request, undefined, undefined);
      sinon.assert.calledWith(getScenarioIdsForSubproblem, subproblemId);
      sinon.assert.calledWith(getDefaultScenarioId, workspaceId);
      sinon.assert.calledWith(setDefaultScenario, workspaceId, otherScenarioId);
      expect(utilStub.handleError).to.have.been.called();
    });

  });
});

'use strict';
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var subproblemRepoStub = {
  query: () => {},
  get: () => {},
  createInTransaction: () => {},
  update: () => {},
  delete: () => {},
  getSubproblemIds: () => {}
};

var scenarioRepoStub = {
  createInTransaction: () => {},
  getScenarioIdsForSubproblem: () => {}
};

var workspaceRepoStub = {
  getDefaultSubproblem: () => {},
  setDefaultSubProblem: () => {},
  setDefaultScenario: () => {}
};

var utilStub = chai.spy();

const dbArgumement = {
  './subProblemRepository': () => {
    return subproblemRepoStub;
  },
  './scenarioRepository': () => {
    return scenarioRepoStub;
  },
  './workspaceRepository': () => {
    return workspaceRepoStub;
  },
  './util': utilStub
};

var db = {
  runInTransaction: (transactions, callback) => {
    transactions(undefined, callback);
  }
};
const subProblemHandler = proxyquire(
  '../node-backend/subProblemHandler',
  dbArgumement
)(db);

describe('the subproblem handler', () => {
  const error = 'error';

  describe('query', () => {
    var query;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      query = sinon.stub(subproblemRepoStub, 'query');
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
    utilStub.handleError = chai.spy();

    it('should call the subproblem repository with the correct arguments', () => {
      const result = [];
      query.onCall(0).yields(null, result);

      subProblemHandler.query(request, response, next);

      sinon.assert.calledWith(query, workspaceId);
      expect(utilStub.handleError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result);
    });

    it("should not call reponse.json if there's an error", function () {
      query.onCall(0).yields(error, null);

      subProblemHandler.query(request, response, next);

      sinon.assert.calledWith(query, workspaceId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.handleError).to.have.been.called.with(error, next);
    });
  });

  describe('get', () => {
    var get;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      get = sinon.stub(subproblemRepoStub, 'get');
      utilStub.handleError = chai.spy();
    });

    afterEach(() => {
      get.restore();
    });

    const workspaceId = 10;
    const subProblemId = 1984;
    const request = {
      params: {
        workspaceId: workspaceId,
        subProblemId: subProblemId
      }
    };
    const next = chai.spy();

    it('should call the subproblem repository with the correct arguments', () => {
      const result = {};
      get.onCall(0).yields(null, result);

      subProblemHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId, subProblemId);
      expect(utilStub.handleError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result);
    });

    it("should not call reponse.json if there's an error", function () {
      get.onCall(0).yields(error, null);
      subProblemHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId, subProblemId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.handleError).to.have.been.called.with(error, next);
    });
  });

  describe('create', () => {
    var subproblemCreate;
    var subProblemGet;
    var scenarioCreate;

    const workspaceId = 10;
    const title = 'title';
    const definition = {};
    const request = {
      params: {
        workspaceId: workspaceId
      },
      body: {
        title: title,
        definition: definition,
        scenarioState: {}
      }
    };
    const subProblemId = 1984;

    const next = chai.spy();

    const result = {
      id: subProblemId
    };

    beforeEach(() => {
      subproblemCreate = sinon.stub(subproblemRepoStub, 'createInTransaction');
      subProblemGet = sinon.stub(subproblemRepoStub, 'get');
      scenarioCreate = sinon.stub(scenarioRepoStub, 'createInTransaction');
      utilStub.handleError = chai.spy();
    });

    afterEach(() => {
      subproblemCreate.restore();
      scenarioCreate.restore();
      subProblemGet.restore();
    });

    it('should call res.json with the created subproblem', (done) => {
      var expectations = function (subproblem) {
        expect(subproblem).to.equal(result);
        expect(next).to.have.not.been.called();
        done();
      };
      var response = {
        json: expectations,
        status: chai.spy()
      };

      subproblemCreate.onCall(0).yields(null, result);
      subProblemGet.onCall(0).yields(null, result);
      scenarioCreate.onCall(0).yields(null);

      subProblemHandler.create(request, response, next);
      expect(response.status).to.have.been.called.with(201);
    });

    it('should call util.handleError with an error if it cannot create a subproblem', () => {
      var response = {
        status: chai.spy()
      };
      subproblemCreate.onCall(0).yields(error);
      subProblemHandler.create(request, response, next);
      expect(utilStub.handleError).to.have.been.called.with(error);
      expect(response.status).to.have.not.been.called();
    });

    it('should call util.handleError with an error if it cannot create a scenario', () => {
      var response = {
        status: chai.spy()
      };
      subproblemCreate.onCall(0).yields(null, result);
      scenarioCreate.onCall(0).yields(error);
      subProblemHandler.create(request, response, next);
      expect(utilStub.handleError).to.have.been.called.with(error);
      expect(response.status).to.have.not.been.called();
    });

    it('should call util.handleError with an error if it cannot get the new subproblem', () => {
      var response = {
        status: chai.spy()
      };
      subproblemCreate.onCall(0).yields(null, result);
      scenarioCreate.onCall(0).yields(null, result);
      subProblemGet.onCall(0).yields(error);
      subProblemHandler.create(request, response, next);
      expect(utilStub.handleError).to.have.been.called.with(error);
      expect(response.status).to.have.not.been.called();
    });
  });

  describe('update', function () {
    var update;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      update = sinon.stub(subproblemRepoStub, 'update');
      utilStub.handleError = chai.spy();
    });

    afterEach(() => {
      update.restore();
    });

    const subProblemId = 1984;
    const title = 'title';
    const definition = {};
    const request = {
      params: {
        subProblemId: subProblemId
      },
      body: {
        title: title,
        definition: definition
      }
    };
    const next = chai.spy();

    it('should call the subproblem repository with the correct arguments', () => {
      const result = {
        rows: [{}]
      };
      update.onCall(0).yields(null, result);

      subProblemHandler.update(request, response, next);
      sinon.assert.calledWith(update, definition, title, subProblemId);
      expect(utilStub.handleError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result);
    });

    it("should not call reponse.json if there's an error", function () {
      update.onCall(0).yields(error, null);
      subProblemHandler.update(request, response, next);
      sinon.assert.calledWith(update, definition, title, subProblemId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.handleError).to.have.been.called.with(error, next);
    });
  });

  describe('delete', function () {
    var deleteStub;
    var getSubproblemIds;
    var getDefaultSubproblem;
    var setDefaultSubProblem;
    var getScenarioIdsForSubproblem;
    var setDefaultScenario;

    const subproblemId = 37;
    const workspaceId = 40;
    const nonDefaultSubproblemId = 42;
    const request = {
      params: {
        subproblemId: subproblemId,
        workspaceId: workspaceId
      }
    };
    const subproblemIds = [{id: subproblemId}, {id: nonDefaultSubproblemId}];

    beforeEach(() => {
      deleteStub = sinon.stub(subproblemRepoStub, 'delete');
      getSubproblemIds = sinon.stub(subproblemRepoStub, 'getSubproblemIds');
      getDefaultSubproblem = sinon.stub(
        workspaceRepoStub,
        'getDefaultSubproblem'
      );
      setDefaultSubProblem = sinon.stub(
        workspaceRepoStub,
        'setDefaultSubProblem'
      );
      getScenarioIdsForSubproblem = sinon.stub(
        scenarioRepoStub,
        'getScenarioIdsForSubproblem'
      );
      setDefaultScenario = sinon.stub(workspaceRepoStub, 'setDefaultScenario');
      utilStub.handleError = chai.spy();
    });

    afterEach(() => {
      deleteStub.restore();
      getSubproblemIds.restore();
      getDefaultSubproblem.restore();
      setDefaultSubProblem.restore();
      getScenarioIdsForSubproblem.restore();
      setDefaultScenario.restore();
    });

    it('should call reponse.sendstatus with ok when deleting a non-default problem', (done) => {
      const next = chai.spy();
      const expectations = function (status) {
        expect(next).to.have.not.been.called();
        expect(status).to.equal(200);
        done();
      };
      const response = {
        sendStatus: expectations
      };
      getSubproblemIds
        .onCall(0)
        .yields(null, [subproblemId, nonDefaultSubproblemId]);
      getDefaultSubproblem.onCall(0).yields(null, nonDefaultSubproblemId);
      deleteStub.onCall(0).yields(null);
      subProblemHandler.delete(request, response, next);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      sinon.assert.calledWith(deleteStub, subproblemId);
      expect(utilStub.handleError).not.to.have.been.called();
    });

    it('should call reponse.sendstatus with ok when deleting the default problem', (done) => {
      const next = chai.spy();
      const expectations = function (status) {
        expect(next).to.have.not.been.called();
        expect(status).to.equal(200);
        done();
      };
      const response = {
        sendStatus: expectations
      };
      getSubproblemIds.onCall(0).yields(null, subproblemIds);
      getDefaultSubproblem.onCall(0).yields(null, subproblemId);

      setDefaultSubProblem.onCall(0).yields(null);
      getScenarioIdsForSubproblem.onCall(0).yields(null, [{id: 1337}]);
      setDefaultScenario.onCall(0).yields(null);
      deleteStub.onCall(0).yields(null);
      subProblemHandler.delete(request, response, next);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      sinon.assert.calledWith(deleteStub, subproblemId);
      expect(utilStub.handleError).not.to.have.been.called();
    });

    it("should call util.handleError if there's an error getting the subproblem ids", function () {
      getSubproblemIds.onCall(0).yields(error);
      subProblemHandler.delete(request, undefined, undefined);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      expect(utilStub.handleError).to.have.been.called();
    });

    it('should call util.handleError if there is only one subproblem', function () {
      const notEnoughError = 'Cannot delete the only subproblem for workspace';
      getSubproblemIds.onCall(0).yields(null, [1]);
      subProblemHandler.delete(request, undefined, undefined);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      expect(utilStub.handleError).to.have.been.called.with(notEnoughError);
    });

    it("should call util.handleError if there's an error getting the default subproblem", function () {
      const next = chai.spy();
      const response = {};
      getSubproblemIds.onCall(0).yields(null, subproblemIds);
      getDefaultSubproblem.onCall(0).yields(error);
      subProblemHandler.delete(request, response, next);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      expect(utilStub.handleError).to.have.been.called();
    });

    it("should call util.handleError if there's an error setting the default subproblem", function () {
      const next = chai.spy();
      const response = {};
      getSubproblemIds.onCall(0).yields(null, subproblemIds);
      getDefaultSubproblem.onCall(0).yields(null, subproblemId);

      setDefaultSubProblem.onCall(0).yields(error);
      subProblemHandler.delete(request, response, next);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      expect(utilStub.handleError).to.have.been.called();
    });

    it("should call util.handleError if there's an error getting the scenario ids for the new default subproblem", function () {
      const next = chai.spy();
      const response = {};
      getSubproblemIds.onCall(0).yields(null, subproblemIds);
      getDefaultSubproblem.onCall(0).yields(null, subproblemId);

      setDefaultSubProblem.onCall(0).yields(null);
      getScenarioIdsForSubproblem.onCall(0).yields(error);
      subProblemHandler.delete(request, response, next);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      expect(utilStub.handleError).to.have.been.called();
    });

    it("should call util.handleError if there's an error setting the default scenario", function () {
      const next = chai.spy();
      const response = {};
      getSubproblemIds.onCall(0).yields(null, subproblemIds);
      getDefaultSubproblem.onCall(0).yields(null, subproblemId);

      setDefaultSubProblem.onCall(0).yields(null);
      getScenarioIdsForSubproblem.onCall(0).yields(null, [{id: 1337}]);
      setDefaultScenario.onCall(0).yields(error);
      subProblemHandler.delete(request, response, next);
      sinon.assert.calledWith(getSubproblemIds, workspaceId);
      expect(utilStub.handleError).to.have.been.called();
    });

    it("should call util.handleError if there's an error deleting", function () {
      deleteStub.onCall(0).yields(error);
      getSubproblemIds.onCall(0).yields(null, subproblemIds);
      getDefaultSubproblem.onCall(0).yields(null, nonDefaultSubproblemId);
      subProblemHandler.delete(request, undefined, undefined);
      expect(utilStub.handleError).to.have.been.called();
    });
  });
});

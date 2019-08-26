'use strict';
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var subproblemRepoStub = {
  query: () => { },
  get: () => { },
  create: () => { },
  update: () => { }
};

var scenarioRepoStub = {
  create: () => { }
};
var utilStub = chai.spy();

const dbArgumement = {
  './subProblemRepository': () => {
    return subproblemRepoStub;
  },
  './scenarioRepository': () => {
    return scenarioRepoStub;
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
  dbArgumement)(db);

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
    utilStub.checkForError = chai.spy();

    it('should call the subproblem repository with the correct arguments', () => {
      const result = {
        rows: []
      };
      query.onCall(0).yields(null, result);

      subProblemHandler.query(request, response, next);

      sinon.assert.calledWith(query, workspaceId);
      expect(utilStub.checkForError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows);
    });

    it('should not call reponse.json if there\'s an error', function() {
      query.onCall(0).yields(error, null);

      subProblemHandler.query(request, response, next);

      sinon.assert.calledWith(query, workspaceId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });

  describe('get', () => {
    var get;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      get = sinon.stub(subproblemRepoStub, 'get');
      utilStub.checkForError = chai.spy();
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
      const result = {
        rows: [
          {}
        ]
      };
      get.onCall(0).yields(null, result);

      subProblemHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId, subProblemId);
      expect(utilStub.checkForError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows[0]);
    });

    it('should not call reponse.json if there\'s an error', function() {
      get.onCall(0).yields(error, null);
      subProblemHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId, subProblemId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });

  describe('create', () => {
    var subproblemCreate;
    var subProblemGet;
    var scenarioCreate;
    var response = {};

    const workspaceId = 10;
    const title = 'title';
    const definition = {};
    const request = {
      params: {
        workspaceId: workspaceId,
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
      rows: [{
        id: subProblemId
      }]
    };

    beforeEach(() => {
      response.json = chai.spy();

      subproblemCreate = sinon.stub(subproblemRepoStub, 'create');
      subProblemGet = sinon.stub(subproblemRepoStub, 'get');
      scenarioCreate = sinon.stub(scenarioRepoStub, 'create');
      utilStub.checkForError = chai.spy();
    });

    afterEach(() => {
      subproblemCreate.restore();
      scenarioCreate.restore();
      subProblemGet.restore();
    });

    it('should call res.json with the created subproblem', (done) => {
      var expectations = function(subproblem) {
        expect(subproblem).to.equal(result.rows[0]);
        expect(next).to.have.not.been.called();
        done();
      };
      var response = {
        json: expectations
      };

      subproblemCreate.onCall(0).yields(null, result);
      subProblemGet.onCall(0).yields(null, result);
      scenarioCreate.onCall(0).yields(null);

      subProblemHandler.create(request, response, next);
    });

    it('should call util.checkForError with an error if it cannot create a subproblem', () => {
      var response = {};
      subproblemCreate.onCall(0).yields(error);
      subProblemHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

    it('should call util.checkForError with an error if it cannot create a scenario', () => {
      var response = {};
      subproblemCreate.onCall(0).yields(null, result);
      scenarioCreate.onCall(0).yields(error);
      subProblemHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

    it('should call util.checkForError with an error if it cannot get the new subproblem', () => {
      var response = {};
      subproblemCreate.onCall(0).yields(null, result);
      scenarioCreate.onCall(0).yields(null, result);
      subProblemGet.onCall(0).yields(error);
      subProblemHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });
  });

  describe('update', function() {
    var update;
    var response = {};

    beforeEach(() => {
      response.json = chai.spy();
      update = sinon.stub(subproblemRepoStub, 'update');
      utilStub.checkForError = chai.spy();
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
        rows: [
          {}
        ]
      };
      update.onCall(0).yields(null, result);

      subProblemHandler.update(request, response, next);
      sinon.assert.calledWith(update, definition, title, subProblemId);
      expect(utilStub.checkForError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result);
    });

    it('should not call reponse.json if there\'s an error', function() {
      update.onCall(0).yields(error, null);
      subProblemHandler.update(request, response, next);
      sinon.assert.calledWith(update, definition, title, subProblemId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });

});

'use strict';
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var subproblemRepoStub = {
  create: () => { }
};
var scenarioRepoStub = {
  create: () => { }
};
var workspaceRepoStub = {
  create: () => { },
  query: () => { },
  setDefaultScenario: () => { },
  setDefaultSubProblem: () => { },
  getWorkspaceInfo: () => { },
  get: () => {},
  update: () => {},
  delete: () => {}
};
var utilStub = {
  checkForError: () => { },
  getUser: () => { },
  reduceProblem: () => { },
  getRanges: () => { }
};

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
const workspaceHandler = proxyquire(
  '../node-backend/workspaceHandler',
  dbArgumement)(db);

describe('the workspace handler', () => {
  const userId = 37;
  const user = {
    id: userId
  };
  const error = 'error';
  const workspaceId = 1337;

  describe('query', () => {
    var query;
    var response = {};
    var getUser;
    const request = {};
    const next = chai.spy();
    utilStub.checkForError = chai.spy();

    beforeEach(() => {
      response.json = chai.spy();
      query = sinon.stub(workspaceRepoStub, 'query');
      getUser = sinon.stub(utilStub, 'getUser');
      getUser.onCall(0).returns(user);
    });

    afterEach(() => {
      query.restore();
      getUser.restore();
    });

    it('should call the workspace repository with the correct arguments', () => {
      const result = {
        rows: []
      };
      query.onCall(0).yields(null, result);

      workspaceHandler.query(request, response, next);

      sinon.assert.calledWith(query, userId);
      expect(utilStub.checkForError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows);
    });

    it('should not call reponse.json if there\'s an error', function() {
      query.onCall(0).yields(error, null);

      workspaceHandler.query(request, response, next);

      sinon.assert.calledWith(query, userId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });

  describe('create', () => {
    var workspaceCreate;
    var subProblemCreate;
    var setDefaultSubProblem;
    var scenarioCreate;
    var setDefaultScenario;
    var getWorkspaceInfo;

    var getUser;
    var reduceProblem;
    var getRanges;

    const workspaceId = 10;
    const title = 'title';
    const request = {
      params: {
        workspaceId: workspaceId,
      },
      body: {
        title: title,
        problem: {}
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
      workspaceCreate = sinon.stub(workspaceRepoStub, 'create');
      subProblemCreate = sinon.stub(subproblemRepoStub, 'create');
      setDefaultSubProblem = sinon.stub(workspaceRepoStub, 'setDefaultSubProblem');
      scenarioCreate = sinon.stub(scenarioRepoStub, 'create');
      setDefaultScenario = sinon.stub(workspaceRepoStub, 'setDefaultScenario');
      getWorkspaceInfo = sinon.stub(workspaceRepoStub, 'getWorkspaceInfo');

      utilStub.checkForError = chai.spy();
      getUser = sinon.stub(utilStub, 'getUser');
      getUser.onCall(0).returns(user);

      reduceProblem = sinon.stub(utilStub, 'reduceProblem');
      reduceProblem.onCall(0).returns(request.body.problem);

      getRanges = sinon.stub(utilStub, 'getRanges');
      getRanges.onCall(0).returns({});
    });

    afterEach(() => {
      workspaceCreate.restore();
      subProblemCreate.restore();
      setDefaultSubProblem.restore();
      scenarioCreate.restore();
      setDefaultScenario.restore();
      getWorkspaceInfo.restore();
      getUser.restore();
      reduceProblem.restore();
      getRanges.restore();
    });

    it('should call response.json with the created workspace', (done) => {
      var expectations = function(workspace) {
        expect(workspace).to.equal(result.rows[0]);
        expect(next).to.have.not.been.called();
        done();
      };
      var response = {
        json: expectations
      };

      workspaceCreate.onCall(0).yields(null, result);
      subProblemCreate.onCall(0).yields(null, result);
      setDefaultSubProblem.onCall(0).yields(null);
      scenarioCreate.onCall(0).yields(null, result);
      setDefaultScenario.onCall(0).yields(null);
      getWorkspaceInfo.onCall(0).yields(null, result);

      workspaceHandler.create(request, response, next);
    });

    it('should call util.checkForError with an error if it cannot create a worskapce', () => {
      var response = {};
      workspaceCreate.onCall(0).yields(error);

      workspaceHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

    it('should call util.checkForError with an error if it cannot create a subproblem', () => {
      var response = {};
      workspaceCreate.onCall(0).yields(null, result);
      subProblemCreate.onCall(0).yields(error);

      workspaceHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

    it('should call util.checkForError with an error if it cannot set a default subproblem', () => {
      var response = {};
      workspaceCreate.onCall(0).yields(null, result);
      subProblemCreate.onCall(0).yields(null, result);
      setDefaultSubProblem.onCall(0).yields(error);

      workspaceHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

    it('should call util.checkForError with an error if it cannot create a scenario', () => {
      var response = {};
      workspaceCreate.onCall(0).yields(null, result);
      subProblemCreate.onCall(0).yields(null, result);
      setDefaultSubProblem.onCall(0).yields(null);
      scenarioCreate.onCall(0).yields(error);

      workspaceHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

    it('should call util.checkForError with an error if it cannot set a default scenario', () => {
      var response = {};
      workspaceCreate.onCall(0).yields(null, result);
      subProblemCreate.onCall(0).yields(null, result);
      setDefaultSubProblem.onCall(0).yields(null);
      scenarioCreate.onCall(0).yields(null, result);
      setDefaultScenario.onCall(0).yields(error);

      workspaceHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

    it('should call util.checkForError with an error if it cannot get workspace info', () => {
      var response = {};
      workspaceCreate.onCall(0).yields(null, result);
      subProblemCreate.onCall(0).yields(null, result);
      setDefaultSubProblem.onCall(0).yields(null);
      scenarioCreate.onCall(0).yields(null, result);
      setDefaultScenario.onCall(0).yields(null);
      getWorkspaceInfo.onCall(0).yields(error);

      workspaceHandler.create(request, response, next);
      expect(utilStub.checkForError).to.have.been.called.with(error);
    });

  });

  describe('get', () => {
    var get;
    var response = {};
    const request = {
      params: {
        id: workspaceId
      }
    };
    const next = chai.spy();
    
    beforeEach(() => {
      response.json = chai.spy();
      get = sinon.stub(workspaceRepoStub, 'get');
      utilStub.checkForError = chai.spy();
    });

    afterEach(() => {
      get.restore();
    });

    it('should call the workspace repository with the correct arguments', () => {
      const result = {
        rows: []
      };
      get.onCall(0).yields(null, result);

      workspaceHandler.get(request, response, next);

      sinon.assert.calledWith(get, workspaceId);
      expect(utilStub.checkForError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows[0]);
    });

    it('should not call reponse.json if there\'s an error', function() {
      get.onCall(0).yields(error, null);

      workspaceHandler.get(request, response, next);

      sinon.assert.calledWith(get, workspaceId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });

  describe('update', () => {
    var update;
    var response = {};
    const title = 'title';
    const request = {
      params: {
        id: workspaceId
      },
      body: {
        problem: {
          title: title
        }
      }
    };
    const next = chai.spy();
    
    beforeEach(() => {
      response.end = chai.spy();
      update = sinon.stub(workspaceRepoStub, 'update');
      utilStub.checkForError = chai.spy();
    });

    afterEach(() => {
      update.restore();
    });

    it('should call the workspace repository with the correct arguments', () => {
      update.onCall(0).yields(null);

      workspaceHandler.update(request, response, next);

      sinon.assert.calledWith(update, title, request.body.problem, workspaceId);
      expect(utilStub.checkForError).not.to.have.been.called();
      expect(response.end).to.have.been.called();
    });

    it('should not call reponse.end if there\'s an error', function() {
      update.onCall(0).yields(error);

      workspaceHandler.update(request, response, next);

      sinon.assert.calledWith(update, title, request.body.problem, workspaceId);
      expect(response.end).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });

  describe('delete', () => {
    var del;
    var response = {};
    const request = {
      params: {
        id: workspaceId
      }
    };
    const next = chai.spy();
    
    beforeEach(() => {
      response.end = chai.spy();
      del = sinon.stub(workspaceRepoStub, 'delete');
      utilStub.checkForError = chai.spy();
    });

    afterEach(() => {
      del.restore();
    });

    it('should call the workspace repository with the correct arguments', () => {
      const result = {
        rows: []
      };
      del.onCall(0).yields(null, result);

      workspaceHandler.delete(request, response, next);

      sinon.assert.calledWith(del, workspaceId);
      expect(utilStub.checkForError).not.to.have.been.called();
      expect(response.end).to.have.been.called();
    });

    it('should not call reponse.end if there\'s an error', function() {
      del.onCall(0).yields(error, null);

      workspaceHandler.delete(request, response, next);

      sinon.assert.calledWith(del, workspaceId);
      expect(response.end).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });
});

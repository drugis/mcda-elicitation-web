'use strict';
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var repoStub = {
  put: () => { },
  get: () => { }
};

var utilStub = chai.spy();
const dbArgumement = {
  './workspaceSettingsRepository': () => {
    return repoStub;
  },
  './util': utilStub
};

const workspaceSettingsHandler = proxyquire(
  '../node-backend/workspaceSettingsHandler',
  dbArgumement)({});

describe('the workspaceSettingsHandler', () => {
  const error = 'error';
  const workspaceId = 10;

  describe('get', () => {
    var get;
    var response = {};
    const request = {
      params: {
        workspaceId: workspaceId
      }
    };
    const next = chai.spy();
    
    beforeEach(() => {
      response.json = chai.spy();
      get = sinon.stub(repoStub, 'get');
      utilStub.handleError = chai.spy();
    });

    afterEach(() => {
      get.restore();
    });

    it('should call the workspace settings repository with the correct arguments', () => {
      const result = {
        rows: [{
          settings: {}
        }]
      };
      get.onCall(0).yields(null, result);

      workspaceSettingsHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId);
      expect(utilStub.handleError).not.to.have.been.called();
      expect(response.json).to.have.been.called.with(result.rows[0].settings);
    });

    it('should not call reponse.json if there\'s an error', function() {
      get.onCall(0).yields(error, null);
      workspaceSettingsHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.handleError).to.have.been.called.with(error, next);
    });
  });

  describe('put', () => {
    var put;
    var response = {};
    const request = {
      params: {
        workspaceId: workspaceId
      },
      body: {}
    };
    const next = chai.spy();
    
    beforeEach(() => {
      response.sendStatus = chai.spy();
      put = sinon.stub(repoStub, 'put');
      utilStub.handleError = chai.spy();
    });

    afterEach(() => {
      put.restore();
    });

    it('should call the workspace settings repository with the correct arguments', () => {
      put.onCall(0).yields(null);

      workspaceSettingsHandler.put(request, response, next);
      sinon.assert.calledWith(put, workspaceId);
      expect(utilStub.handleError).not.to.have.been.called();
      expect(response.sendStatus).to.have.been.called.with(200);
    });

    it('should not call reponse.sendStatus if there\'s an error', function() {
      put.onCall(0).yields(error);
      workspaceSettingsHandler.put(request, response, next);
      sinon.assert.calledWith(put, workspaceId);
      expect(response.sendStatus).not.to.have.been.called();
      expect(utilStub.handleError).to.have.been.called.with(error, next);
    });
  });
});

'use strict';
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var repoStub = {
  update: () => { },
  get: () => { }
};

var utilStub = chai.spy();
const dbArgumement = {
  './orderingRepository': () => {
    return repoStub;
  },
  './util': utilStub
};

const orderingHandler = proxyquire(
  '../node-backend/orderingHandler',
  dbArgumement)({});

describe('the in ordering handler', () => {
  const error = 'error';

  describe('get', () => {
    var get;
    var response = {};
    const workspaceId = 10;
    const request = {
      params: {
        workspaceId: workspaceId
      }
    };
    const next = chai.spy();

    beforeEach(() => {
      response.json = chai.spy();
      get = sinon.stub(repoStub, 'get');
      utilStub.checkForError = chai.spy();
    });

    afterEach(() => {
      get.restore();
    });

    it('should call the ordering repository with the correct arguments', () => {
      const result = {
        rows: [{
          ordering: {}
        }]
      };
      get.onCall(0).yields(null, result);

      orderingHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId);
      expect(utilStub.checkForError).to.have.been.called();
      expect(response.json).to.have.been.called.with({ ordering: result.rows[0].ordering });
    });

    it('should not call reponse.json if there\'s an error', function() {
      get.onCall(0).yields(error, null);
      orderingHandler.get(request, response, next);
      sinon.assert.calledWith(get, workspaceId);
      expect(response.json).not.to.have.been.called();
      expect(utilStub.checkForError).to.have.been.called.with(error, next);
    });
  });
});

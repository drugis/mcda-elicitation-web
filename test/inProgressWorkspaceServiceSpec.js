'use strict';
const sinon = require('sinon');
const testUtil = require('./testUtil');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var repoStub = {
  create: () => {}
};
const inProgressWorkspaceService = proxyquire(
  '../node-backend/inProgressWorkspaceService',
  {
    './inProgressWorkspaceRepository': () => {
      return repoStub;
    }
  })({});


describe('the in progress workspace service', () => {
  describe('create', () => {
    var create;
    beforeEach(() => {
      create = sinon.stub(repoStub, 'create');
    });
    afterEach(() => {
      create.restore();
    });

    it('should call the in progress workspace repository with the correct arguments', () => {
      const userId = 132;
      const problem = { prop: 'val' };
      const request = {
        user: {
          id: userId
        },
        body: problem
      };
      const response = {
        json: chai.spy()
      };
      const createdId = 321;
      const result = {
        rows: [{
          id: createdId
        }]
      };
      create.onCall(0).yields(null, result);
      const next = chai.spy();

      inProgressWorkspaceService.create(request, response, next);

      sinon.assert.calledWith(create, userId, problem);
      expect(response.json).to.have.been.called.with({ id: createdId });
      expect(next).not.to.have.been.called();
    });
  });
});

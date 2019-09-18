'use strict';
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const expect = chai.expect;

var fsStub = {
  readFileSync: chai.spy(),
  existsSync: chai.spy()
};
var httpsStub = {
  request: chai.spy()
};
var dbStub = {
  query: chai.spy()
};

const startupDiagnosticsService = proxyquire(
  '../node-backend/startupDiagnosticsService', {
  'fs': () => {
    return fsStub;
  },
  'https': () => {
    return httpsStub;
  }
})(dbStub);

describe('the startup diagnostics', () => {
  describe('runStartupDiagnostics', () => {
    var dbQuery;
    var httpsRequest;
    var readFileSync;
    var existsSync;
    var postRequest = {
      on: function(argument, callback) {
        callback();
      }
    };

    beforeEach(() => {
      dbQuery = sinon.stub(dbStub, 'query');
      httpsRequest = sinon.stub(httpsStub, 'request');
      readFileSync = sinon.stub(fsStub, 'readFileSync');
      existsSync = sinon.stub(fsStub, 'existsSync');
    });

    afterEach(() => {
      dbQuery.restore();
      httpsRequest.restore();
      readFileSync.restore();
      existsSync.restore();
    });

    it('should call the callback without errors', (done) => {
      var callback = function(errors) {
        expect(errors).to.equal([]);
        done();
      };

      dbQuery.onCall(0).yields(null);

      startupDiagnosticsService.runStartupDiagnostics(callback);
    });
  });

});

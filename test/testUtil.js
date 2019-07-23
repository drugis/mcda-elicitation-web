'use strict';
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

function createQueryCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult, done) {
  return function(error, result) {
    sinon.assert.calledWith(query, expectedQuery, queryInputValues);
    expect(error).to.be.null;
    expect(result).to.deep.equal(expectedResult);
    done();
  };
}


function createQueryTwoArgumentCallbackWithTests(query, expectedQuery, queryInputValues, expectedResult1, expectedResult2, done) {
  return function(error, result1, result2) {
    sinon.assert.calledWith(query, expectedQuery, queryInputValues);
    expect(error).to.be.null;
    expect(result1).to.deep.equal(expectedResult1);
    expect(result2).to.deep.equal(expectedResult2);
    done();
  };
}


function createQueryErrorCallbackWithTests(query, expectedQuery, queryInputValues, expectedError, done) {
  return function(error) {
    sinon.assert.calledWith(query, expectedQuery, queryInputValues);
    expect(error).to.equal(expectedError);
    done();
  };
}

module.exports = {
  createQueryCallbackWithTests: createQueryCallbackWithTests,
  createQueryTwoArgumentCallbackWithTests: createQueryTwoArgumentCallbackWithTests,
  createQueryErrorCallbackWithTests: createQueryErrorCallbackWithTests
};

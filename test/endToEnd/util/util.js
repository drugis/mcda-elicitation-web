'use strict';

const _ = require('lodash');
const chai = require('chai');

function getOnlyProperty(value) {
  return value[_.keys(value)[0]];
}

function isElementHidden(browser, path) {
  browser.element('xpath', path, function(result) {
    const elementId = getOnlyProperty(result.value);
    browser.elementIdDisplayed(elementId, function(isDisplayedResult) {
      chai.expect(isDisplayedResult.value).to.be.false;
    });
  });
}

function isElementNotPresent(browser, path) {
  browser.element('xpath', path, function(result) {
    // this test outputs an error message to the console but does not make the overall test fail
    chai.expect(result.state).to.equal('no such element');
  });
}

module.exports = {
  getOnlyProperty: getOnlyProperty,
  isElementHidden: isElementHidden,
  isElementNotPresent: isElementNotPresent
};
'use strict';

const _ = require('lodash');
const chai = require('chai');

function getOnlyProperty(value) {
  return _.values(value)[0];
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
  browser.elements('xpath', path, function(result) {
    chai.expect(result.value.length).to.equal(0);
  });
}

module.exports = {
  getOnlyProperty: getOnlyProperty,
  isElementHidden: isElementHidden,
  isElementNotPresent: isElementNotPresent
};

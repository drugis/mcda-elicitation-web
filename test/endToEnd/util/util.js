'use strict';

const _ = require('lodash');
const chai = require('chai');

const xpathSelectorType = 'xpath';
const TIMEOUT = 10;

function delayedClick(browser, clickPath, expectPath, selectorType = 'css selector', attempts = 500) {
  if (attempts === 0) {
    throw new Error('! Could not locate "' + expectPath + '".');
  } else {
    browser.waitForElementVisible(clickPath);
    browser.click(clickPath);
    browser.elements(selectorType, expectPath, function(result) {
      if (result.value.length === 0) {
        console.log('! Could not locate "' + expectPath + '". Attempting again in ' + TIMEOUT + ' milliseconds.');
        browser.pause(TIMEOUT);
        delayedClick(browser, clickPath, expectPath, selectorType, --attempts);
      }
    });
  }
}

function getFirstProperty(value) {
  return _.values(value)[0];
}

function isElementHidden(browser, path) {
  browser.element('xpath', path, function(result) {
    const elementId = getFirstProperty(result.value);
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
  delayedClick: delayedClick,
  getFirstProperty: getFirstProperty,
  isElementHidden: isElementHidden,
  isElementNotPresent: isElementNotPresent,
  xpathSelectorType: xpathSelectorType
};

'use strict';

const _ = require('lodash');

const xpathSelectorType = 'xpath';
const TIMEOUT = 500;

function delayedClick(
  browser,
  clickPath,
  expectPath,
  selectorType = 'css selector',
  attempts = 10
) {
  if (attempts === 0) {
    throw new Error('! Could not locate "' + expectPath + '".');
  } else {
    browser.pause(1000);
    browser.waitForElementVisible(clickPath);
    browser.click(clickPath);
    waitForElement(browser, expectPath, selectorType, attempts - 1);
  }
  return browser;
}

function waitForElement(browser, expectPath, selectorType, attempts = 10) {
  browser.elements(selectorType, expectPath, function (result) {
    if (result.value.length === 0) {
      console.log(
        '! Could not locate "' +
          expectPath +
          '". Attempting again in ' +
          TIMEOUT +
          ' milliseconds.'
      );
      browser.pause(TIMEOUT);
      waitForElement(browser, selectorType, attempts - 1);
    }
  });
}

function getFirstProperty(value) {
  return _.values(value)[0];
}

module.exports = {
  delayedClick: delayedClick,
  getFirstProperty: getFirstProperty,
  xpathSelectorType: xpathSelectorType
};

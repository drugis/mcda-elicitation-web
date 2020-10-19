'use strict';

const _ = require('lodash');

const xpathSelectorType = 'xpath';
const TIMEOUT = 100;

function delayedClick(
  browser,
  clickPath,
  expectPath,
  selectorType = 'css selector',
  attempts = 50
) {
  if (attempts === 0) {
    throw new Error('! Could not locate "' + expectPath + '".');
  } else {
    browser.waitForElementVisible(clickPath);
    browser.click(clickPath);
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
        delayedClick(browser, clickPath, expectPath, selectorType, --attempts);
      }
    });
  }
  return browser;
}

function getFirstProperty(value) {
  return _.values(value)[0];
}

module.exports = {
  delayedClick: delayedClick,
  getFirstProperty: getFirstProperty,
  xpathSelectorType: xpathSelectorType
};

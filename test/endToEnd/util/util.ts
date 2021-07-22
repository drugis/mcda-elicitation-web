import _, {isArray} from 'lodash';
import {
  LocateStrategy,
  NightwatchBrowser,
  NightwatchCallbackResult
} from 'nightwatch';

export const xpathSelectorType = 'xpath';
const TIMEOUT = 500;

export function delayedClick(
  browser: NightwatchBrowser,
  clickPath: string,
  expectPath: string,
  selectorType: LocateStrategy = 'css selector',
  attempts: number = 10
) {
  if (attempts === 0) {
    throw new Error('! Could not locate "' + expectPath + '".');
  } else {
    browser.pause(1000);
    browser.waitForElementVisible(clickPath);
    browser.click(clickPath);
    waitForElement(browser, expectPath, selectorType, attempts);
  }
  return browser;
}

function waitForElement(
  browser: NightwatchBrowser,
  expectPath: string,
  selectorType: LocateStrategy,
  attempts: number
) {
  browser.elements(
    selectorType,
    expectPath,
    function (result: NightwatchCallbackResult<Array<{ELEMENT: string}>>) {
      if (isArray(result.value) && result.value.length === 0) {
        console.log(
          '! Could not locate "' +
            expectPath +
            '". Attempting again in ' +
            TIMEOUT +
            ' milliseconds.'
        );
        browser.pause(TIMEOUT);
        waitForElement(browser, expectPath, selectorType, attempts - 1);
      }
    }
  );
}

export function getFirstProperty(value) {
  return _.values(value)[0];
}

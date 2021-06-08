'use strict';

module.exports = {
  afterEach: afterEach,
  'Open manual from login page': goToManualFromLogin,
  'Open manual while logged in': goToManual,
  'Home navigation from login name': goToHomeFromLoginName,
  'Navigate to problem that does not exists through URL manipulation':
    invalidUrl
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');

const TEST_URL = require('./util/constants').TEST_URL;

function afterEach(browser) {
  browser.end();
}

function goToManualFromLogin(browser) {
  browser
    .url(TEST_URL)
    .waitForElementVisible('#manual-link')
    .click('#manual-link')
    .windowHandles(function (result) {
      browser
        .switchWindow(result.value[1])
        .waitForElementVisible('#manual-title-header');
    });
}

function goToManual(browser) {
  loginService
    .login(browser)
    .click('#manual-link')
    .windowHandles(function (result) {
      browser
        .switchWindow(result.value[1])
        .waitForElementVisible('#manual-title-header');
    });
}

function goToHomeFromLoginName(browser) {
  loginService.login(browser);
  const title = 'GetReal course LU 4, activity 4.4';
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');
  util.delayedClick(browser, '#user-name', '#create-workspace-button');
  workspaceService.deleteFromList(browser, 0);
}

function invalidUrl(browser) {
  loginService
    .login(browser)
    .waitForElementVisible('#workspaces-header')
    .url('http://localhost:3002/workspaces/0/problems/1/scenarios/1/overview')
    .waitForElementVisible('#error');
}

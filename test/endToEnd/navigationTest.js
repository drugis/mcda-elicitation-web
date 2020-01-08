'use strict';
const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');

const TEST_URL = require('./util/constants').TEST_URL;

module.exports = {
  afterEach: function(browser) {
    browser.end();
  },

  'Open manual from login page': function(browser) {
    browser
      .url(TEST_URL)
      .waitForElementVisible('#manual-link')
      .click('#manual-link')
      .windowHandles(function(result) {
        browser.switchWindow(result.value[1])
          .waitForElementVisible('#manual-title-header');
      });
  },

  'Open manual while logged in': function(browser) {
    loginService.login(browser)
      .click('#manual-link')
      .windowHandles(function(result) {
        browser.switchWindow(result.value[1])
          .waitForElementVisible('#manual-title-header');
      });
  },

  'Home navigation from login name': function(browser) {
    loginService.login(browser);
    const title = 'GetReal course LU 4, activity 4.4';
    workspaceService.addExample(browser, title)
      .click('#workspace-0')
      .waitForElementVisible('#workspace-title');
    util.delayedClick(browser, '#user-image-link', '#create-workspace-button');
    workspaceService.deleteFromList(browser, 0);
  },

  'Navigate to problem that does not exists through URL manipulation': function(browser) {
    loginService.login(browser)
      .url('http://localhost:3002/#!/workspaces/0/problems/1/scenarios/1/evidence')
      .useXpath()
      .waitForElementVisible('/html/body/error-reporting');
  }
};

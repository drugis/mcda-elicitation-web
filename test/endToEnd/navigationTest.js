'use strict';
const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');

const url = 'http://localhost:3002';

module.exports = {
  afterEach: function(browser) {
    browser.end();
  },

  'Open manual from login page': function(browser) {
    browser
      .url(url)
      .waitForElementVisible('#manual-link')
      .click('#manual-link')
      .windowHandles(function(result) {
        browser.switchWindow(result.value[1])
          .waitForElementVisible('#manual-title-header');
      });
  },

  'Open manual while logged in': function(browser) {
    loginService.login(browser, url, loginService.username, loginService.correctPassword);
    browser
      .click('#manual-link')
      .windowHandles(function(result) {
        browser.switchWindow(result.value[1])
          .waitForElementVisible('#manual-title-header');
      });
  },

  'Home navigation from login name': function(browser) {
    loginService.login(browser, url, loginService.username, loginService.correctPassword);
    const title = 'GetReal course LU 4, activity 4.4';
    workspaceService.addExample(browser, title);
    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title')
      .click('#user-image-link')
      .waitForElementVisible('#create-workspace-button');
    workspaceService.deleteFromList(browser, title);
  },

  'Navigate to problem that does not exists through URL manipulation': function(browser) {
    loginService.login(browser, url, loginService.username, loginService.correctPassword);
    browser.url('http://localhost:3002/#!/workspaces/0/problems/1/scenarios/1/evidence')
      .useXpath()
      .waitForElementVisible('/html/body/error-reporting');
  }
};

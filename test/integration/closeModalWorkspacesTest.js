'use strict';

const loginService = require('./util/loginService');
const testUrl = 'http://localhost:3002';

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
  },

  afterEach: function(browser) {
    browser.end();
  },

  'Cancel adding a workspace': function(browser) {
    var actionButtonPath = '//*[@id="create-workspace-button"]';
    var cancelButtonPath = '//*[@id="close-button"]';
    browser
      .useXpath()
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .waitForElementVisible('//*[@id="empty-workspace-message"]')
      .useCss();
  },

  'Cancel deleting a workspace': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="add-workspace-button"]')
      .waitForElementVisible('//*[@id="workspace-title"]')
      .click('//*[@id="logo"]')
      .click('/html/body/div[2]/div/div[2]/workspaces/div/div[2]/table/tbody/tr/td[3]/a')
      .click('/html/body/div[4]/div/div/button')
      .assert.containsText('/html/body/div[2]/div/div[2]/workspaces/div/div[2]/table/tbody/tr/td[1]/a', 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)')
      .click('/html/body/div[2]/div/div[2]/workspaces/div/div[2]/table/tbody/tr/td[3]/a')
      .click('//*[@id="delete-workspace-confirm-button"]')
      .waitForElementVisible('//*[@id="empty-workspace-message"]')
      .useCss();
  }
};

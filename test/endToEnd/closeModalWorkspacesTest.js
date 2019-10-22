'use strict';

const loginService = require('./util/loginService');
const testUrl = require('./util/constants').testUrl;
const closeModalButton = '//*[@id="close-modal-button"]';
const deleteWorkspaceButton = '//div[2]/div/div[2]/workspaces/div/div[2]/table/tbody/tr/td[3]/a';

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
    var cancelButtonPath = closeModalButton;
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
      .click(deleteWorkspaceButton)
      .click(closeModalButton)
      .assert.containsText('//div[2]/div/div[2]/workspaces/div/div[2]/table/tbody/tr/td[1]/a', 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)')
      .click(deleteWorkspaceButton)
      .click('//*[@id="delete-workspace-confirm-button"]')
      .waitForElementVisible('//*[@id="empty-workspace-message"]')
      .useCss();
  }
};

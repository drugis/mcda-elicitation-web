'use strict';

const loginService = require('./util/loginService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const closeModalButton = '#close-modal-button';
const deleteWorkspaceButton = '#delete-workspace-0';

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser);
  },

  afterEach: function(browser) {
    browser.waitForElementVisible('#empty-workspace-message');
    errorService.isErrorBarHidden(browser).end();
  },

  'Cancel adding a workspace': function(browser) {
    browser
      .click('#create-workspace-button')
      .click(closeModalButton);
  },

  'Cancel deleting a workspace': function(browser) {
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .waitForElementVisible('#workspace-title');

    util.delayedClick(browser, '#logo', deleteWorkspaceButton)
      .click(deleteWorkspaceButton)
      .click(closeModalButton)
      .assert.containsText('#workspace-0', 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)')
      .click(deleteWorkspaceButton)
      .click('#delete-workspace-confirm-button');
  }
};

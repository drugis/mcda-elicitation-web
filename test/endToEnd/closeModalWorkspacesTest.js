'use strict';

const loginService = require('./util/loginService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const closeModalButton = '#close-modal-button';
const deleteWorkspaceButton = '#delete-workspace-0';

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
}

function afterEach(browser) {
  browser.waitForElementVisible('#empty-workspace-message');
  errorService.isErrorBarHidden(browser).end();
}

function cancelAdding(browser) {
  browser
    .click('#create-workspace-button')
    .click(closeModalButton);
}

function cancelDeleting(browser) {
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

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Cancel adding a workspace':  cancelAdding,
  'Cancel deleting a workspace':  cancelDeleting
};

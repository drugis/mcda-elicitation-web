'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Copy a workspace': copy
};

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

const testUrl = require('./util/constants').testUrl;
const NEW_TITLE =
  'Copy of Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function beforeEach(browser) {
  loginService.login(
    browser,
    testUrl,
    loginService.username,
    loginService.correctPassword
  );
  workspaceService.cleanList(browser);
  workspaceService.addExample(browser, title);
  workspaceService.copy(browser, 0, NEW_TITLE);
}

function afterEach(browser) {
  workspaceService.deleteFromList(browser, 1);
  workspaceService.deleteFromList(browser, 0);
  browser.end();
}

function copy(browser) {
  browser
    .click('#done-button')
    .waitForElementVisible('#workspace-title')
    .assert.containsText('#workspace-title', NEW_TITLE);
  workspaceService.goHomeAfterLoading(browser, NEW_TITLE);
}

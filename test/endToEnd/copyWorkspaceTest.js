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
const TITLE =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function copy(browser) {
  loginService.login(
    browser,
    testUrl,
    loginService.username,
    loginService.correctPassword
  );
  workspaceService.cleanList(browser);
  workspaceService.addExample(browser, TITLE);
  workspaceService.copy(browser, 0);
  browser
    .click('#finish-creating-workspace')
    .waitForElementVisible('#workspace-title')
    .assert.containsText('#workspace-title', NEW_TITLE);
  workspaceService.goHomeAfterLoading(browser, NEW_TITLE);
  workspaceService.cleanList(browser);
  workspaceService.cleanUnfinishedList(browser);
  browser.end();
}

'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

const testUrl = 'http://localhost:3002';

module.exports = {
  'Create subproblem': function(browser) {
    const title = 'Test workspace';
    const workspacePath = '/set_pvf.json';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.uploadTestWorkspace(browser, workspacePath);

    browser
      .waitForElementVisible('#workspace-title')
      .click('#preferences-tab')
      .waitForElementVisible('#partial-value-functions-block')
      .click('#c1-pvf-button')
      .click('#save-button')
      .click('#c2-pvf-button')
      .click('#increasing-pvf-option')
      .click('#piece-wise-pvf-option')
      .click('#next-button')
      .click('#piece-wise-next-button')
      .click('#piece-wise-next-button')
      .click('#piece-wise-save-button')
      .waitForElementVisible('#ranking-button:enabled')
      .click('#logo')
      ;

    workspaceService.deleteFromList(browser, title);
    browser.waitForElementVisible('#empty-workspace-message');
    browser.end();
  },
};
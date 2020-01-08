'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const workspacePath = '/partialValueFunctionTestProblem.json';

module.exports = {
  beforeEach: function(browser) {
    loginService.login(browser);
    workspaceService.uploadTestWorkspace(browser, workspacePath);
    browser
      .waitForElementVisible('#workspace-title')
      .click('#preferences-tab')
      .waitForElementVisible('#partial-value-functions-block');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser).end();

  },

  'Set partial value functions': function(browser) {
    browser
      .click('#criterion-0-pvf-button')
      .click('#save-button')
      .click('#criterion-1-pvf-button')
      .click('#increasing-pvf-option')
      .click('#piece-wise-pvf-option')
      .click('#next-button')
      .click('#piece-wise-next-button')
      .click('#piece-wise-next-button')
      .click('#piece-wise-save-button')
      .waitForElementVisible('#ranking-button:enabled');
  },

  'Go to previous step': function(browser) {
    browser
      .click('#criterion-0-pvf-button')
      .click('#piece-wise-pvf-option')
      .click('#next-button')
      .click('#previous-button')
      .waitForElementVisible('#criterion-title');
  }
};

'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const workspacePath = '/partialValueFunctionTestProblem.json';

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.uploadTestWorkspace(browser, workspacePath);
  browser
    .waitForElementVisible('#workspace-title')
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0);
  errorService.isErrorBarHidden(browser).end();

}

function set(browser) {
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
}

function navigate(browser) {
  browser
    .click('#criterion-0-pvf-button')
    .click('#piece-wise-pvf-option')
    .click('#next-button')
    .click('#previous-button')
    .waitForElementVisible('#criterion-title');
}

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Set partial value functions': set,
  'Go to previous step': navigate
};

'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');

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
  workspaceService
    .deleteFromList(browser, 0)
    .end();
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

function setLinearPVF(browser) {
  browser
    .waitForElementVisible('#undefined-pvf-0')
    .waitForElementVisible('#undefined-pvf-1')
    .click('#set-increasing-pvf-0')
    .waitForElementVisible('#defined-pvf-0')
    .click('#set-decreasing-pvf-0')
    .waitForElementVisible('#defined-pvf-0')
    .click('#set-decreasing-pvf-1')
    .waitForElementVisible('#defined-pvf-1');
}

function displayWeights(browser) {
  browser
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#set-increasing-pvf-0')
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#set-increasing-pvf-1')
    .waitForElementVisible('#weight-criterion-0')
    .waitForElementVisible('#weight-criterion-1');
}

function resetTradeOffs(browser) {
  browser
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#set-increasing-pvf-0')
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#set-increasing-pvf-1')
    .assert.containsText('#importance-criterion-0', '?')
    .assert.containsText('#importance-criterion-1', '?')
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .click('#ranking-option-0')
    .click('#save-button')
    .assert.containsText('#importance-criterion-0', '1')
    .assert.containsText('#importance-criterion-1', '2')
    .click('#set-decreasing-pvf-0')
    .assert.containsText('#importance-criterion-0', '?')
    .assert.containsText('#importance-criterion-1', '?')
    ;
}

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Set partial value functions': set,
  'Go to previous step': navigate,
  'Set linear partial value functions via button': setLinearPVF,
  'Display weights when all PVFs are set': displayWeights,
  'Reset set trade-offs when setting a PVF': resetTradeOffs
};

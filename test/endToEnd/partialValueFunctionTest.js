'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Set partial value functions': set,
  'Go to previous step': navigate,
  'Set linear partial value functions via button': setLinearPVF,
  'Display weights when all PVFs are set': displayWeights,
  'Reset set trade-offs when setting a PVF': resetTradeOffs
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');

const workspacePath = '/partialValueFunctionTestProblem.json';

const criterion1Id = 'c1';
const criterion2Id = 'c2';

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(browser, workspacePath);
  browser
    .waitForElementVisible('#workspace-title')
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function set(browser) {
  browser
    .click('#advanced-pvf-button-c1')
    .click('#save-button')
    .waitForElementVisible('#partial-value-functions-block')
    .click('#advanced-pvf-button-c2')
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
    .click('#advanced-pvf-button-c1')
    .click('#piece-wise-pvf-option')
    .click('#next-button')
    .click('#previous-button')
    .waitForElementVisible('#criterion-title');
}

function setLinearPVF(browser) {
  browser
    .waitForElementVisible('#pvf-questionmark-c1')
    .waitForElementVisible('#pvf-questionmark-c2')
    .click('#increasing-pvf-button-c1')
    .waitForElementVisible('#pvfplot-c1')
    .click('#decreasing-pvf-button-c1')
    .waitForElementVisible('#pvfplot-c1')
    .click('#decreasing-pvf-button-c2')
    .waitForElementVisible('#pvfplot-c2');
}

function displayWeights(browser) {
  browser
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#increasing-pvf-button-c1')
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#increasing-pvf-button-c2')
    .waitForElementVisible('#weight-criterion-0')
    .waitForElementVisible('#weight-criterion-1');
}

function resetTradeOffs(browser) {
  browser
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#increasing-pvf-button-c1')
    .waitForElementVisible('#not-all-pvfs-set-warning')
    .click('#increasing-pvf-button-c2')
    .assert.containsText('#importance-criterion-0', '?')
    .assert.containsText('#importance-criterion-1', '?')
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .click('#criterion-option-0')
    .click('#save-button')
    .assert.containsText('#importance-criterion-0', '1')
    .assert.containsText('#importance-criterion-1', '2')
    .click('#decreasing-pvf-button-c1')
    .assert.containsText('#importance-criterion-0', '?')
    .assert.containsText('#importance-criterion-1', '?');
}

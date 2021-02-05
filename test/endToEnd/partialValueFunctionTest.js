'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Set partial value functions': set,
  'Go to previous step': navigate,
  'Set linear partial value functions via button': setLinearPVF,
  'Display weights when all PVFs are set': displayWeights,
  'Reset set trade-offs when setting a PVF': resetTradeOffs,
  'Display deterministic results without initialized configured ranges': deterministic
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');

const workspacePath = '/partialValueFunctionTestProblem.json';

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
    .pause(200)
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
    .click('#increasing-pvf-button-c1')
    .click('#increasing-pvf-button-c2')
    .assert.not.containsText('#weight-criterion-c1', '?')
    .assert.not.containsText('#weight-criterion-c2', '?');
}

function resetTradeOffs(browser) {
  browser
    .click('#increasing-pvf-button-c1')
    .click('#increasing-pvf-button-c2')
    .assert.containsText('#importance-criterion-c1', '?')
    .assert.containsText('#importance-criterion-c2', '?')
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .click('#criterion-option-c1')
    .click('#save-button')
    .assert.containsText('#importance-criterion-c1', '1')
    .assert.containsText('#importance-criterion-c2', '2')
    .assert.not.containsText('#weight-criterion-c1', '?')
    .assert.not.containsText('#weight-criterion-c2', '?')
    .click('#decreasing-pvf-button-c1')
    .assert.containsText('#importance-criterion-c1', '?')
    .assert.containsText('#importance-criterion-c2', '?');
}

function deterministic(browser) {
  setLinearPVF(browser);
  util.delayedClick(
    browser,
    '#deterministic-tab',
    '#deterministic-weights-table'
  );
  browser
    .waitForElementVisible('#value-profile-plot-base')
    .waitForElementVisible('#base-total-value-table')
    .waitForElementVisible('#base-value-profiles-table')
    .waitForElementVisible('#measurements-sensitivity-plot')
    .waitForElementVisible('#preferences-sensitivity-plot');
}

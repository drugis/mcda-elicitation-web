'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Set piecewise linear partial value function': setPieceWisePvf,
  'Set linear partial value functions via button': setLinearPvf,
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

function setPieceWisePvf(browser) {
  browser.click('#advanced-pvf-button-c1');

  browser.expect
    .element('#increasing-pvf-option')
    .text.to.equal('Increasing (2 is best)');
  browser.expect
    .element('#decreasing-pvf-option')
    .text.to.equal('Decreasing (1 is best)');

  browser.click('span.MuiSlider-mark:nth-child(4)');
  browser.expect
    .element('span.MuiSlider-thumb:nth-child(12) > span:nth-child(1)')
    .text.to.equal('1.1');

  browser
    .click('#save-button')
    .waitForElementVisible('#partial-value-functions-block')
    .click('#advanced-pvf-button-c2');

  browser.expect
    .element('#increasing-pvf-option')
    .text.to.equal('Increasing (4 is best)');
  browser.expect
    .element('#decreasing-pvf-option')
    .text.to.equal('Decreasing (3 is best)');

  browser
    .click('#decreasing-pvf-option')
    .click('#save-button')
    .pause(200)
    .waitForElementVisible('#ranking-button:enabled');

  browser.expect.element('#worst-c1').text.to.equal('1');
  browser.expect.element('#best-c1').text.to.equal('2');

  browser.expect.element('#worst-c2').text.to.equal('4');
  browser.expect.element('#best-c2').text.to.equal('3');
}

function setLinearPvf(browser) {
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
  setLinearPvf(browser);
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

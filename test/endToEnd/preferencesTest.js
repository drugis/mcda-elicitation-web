'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Setting the weights through ranking': ranking,
  'Ranking previous button': rankingGoBack,
  'Setting the weights through matching': matching,
  'Matching previous button': matchingGoBack,
  'Setting the weights through precise swing weighting': preciseSwing,
  'Precise swing previous button': preciseSwingGoBack,
  'Setting the weights through imprecise swing weighting': impreciseSwing,
  'Imprecise swing previous button': impreciseSwingGoBack
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

function loadTestWorkspace(browser) {
  workspaceService
    .addExample(browser, 'GetReal course LU 4, activity 4.4')
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');

  errorService
    .isErrorBarHidden(browser)
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

function resetWeights(browser) {
  browser
    .click('#reset-button')
    .assert.containsText('#elicitation-method', 'None')
    .assert.containsText('#importance-criterion-0', '?')
    .assert.containsText('#importance-criterion-1', '?')
    .assert.containsText('#importance-criterion-2', '?');
}

function matchImportanceColumnContents(
  browser,
  method,
  value1,
  value2,
  value3
) {
  browser
    .waitForElementVisible('#perferences-weights-table')
    .assert.containsText('#elicitation-method', method)
    .assert.containsText('#importance-criterion-0', value1)
    .assert.containsText('#importance-criterion-1', value2)
    .assert.containsText('#importance-criterion-2', value3);
}

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  loadTestWorkspace(browser);
  browser.pause(1000);
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function ranking(browser) {
  browser
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .click('#criterion-option-0')
    .click('#next-button')
    .click('#criterion-option-0')
    .click('#save-button');

  matchImportanceColumnContents(browser, 'Ranking', 1, 2, 3);
  resetWeights(browser);
}

function rankingGoBack(browser) {
  browser
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-0')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

function matching(browser) {
  browser
    .click('#matching-button')
    .waitForElementVisible('#matching-title-header')
    .click('#criterion-option-0')
    .click('#next-button')
    .click('#next-button')
    .click('#save-button');

  matchImportanceColumnContents(browser, 'Matching', '100%', '100%', '100%');
  resetWeights(browser);
}

function matchingGoBack(browser) {
  browser
    .click('#matching-button')
    .waitForElementVisible('#matching-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 3')
    .click('#criterion-option-0')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 3')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 3');
}

function preciseSwing(browser) {
  browser
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#criterion-option-0')
    .click('#next-button')
    .click('#save-button');

  matchImportanceColumnContents(
    browser,
    'Precise Swing Weighting',
    '100%',
    '100%',
    '100%'
  );
  resetWeights(browser);
}

function preciseSwingGoBack(browser) {
  browser
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-0')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

function impreciseSwing(browser) {
  browser
    .click('#imprecise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#criterion-option-0')
    .click('#next-button')
    .click('#save-button');

  matchImportanceColumnContents(
    browser,
    'Imprecise Swing Weighting',
    '100%',
    '1-100%',
    '1-100%'
  );
  resetWeights(browser);
}

function impreciseSwingGoBack(browser) {
  browser
    .click('#imprecise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-0')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

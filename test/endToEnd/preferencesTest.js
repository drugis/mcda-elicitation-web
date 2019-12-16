'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

function loadTestWorkspace(browser) {
  workspaceService.addExample(browser, 'GetReal course LU 4, activity 4.4');
  browser
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');

  errorService.isErrorBarHidden(browser);

  browser
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

function resetWeights(browser) {
  browser
    .click('#reset-button')
    .assert.containsText('#ranking-criterion-0', '?')
    .assert.containsText('#ranking-criterion-1', '?')
    .assert.containsText('#ranking-criterion-2', '?')
    ;
}

function matchImportanceColumnContents(browser, value1, value2, value3) {
  browser
    .waitForElementVisible('#trade-off-block')
    .assert.containsText('#ranking-criterion-0', value1)
    .assert.containsText('#ranking-criterion-1', value2)
    .assert.containsText('#ranking-criterion-2', value3)
    ;
}

module.exports = {
  beforeEach: function(browser) {
    loginService.login(browser);
    loadTestWorkspace(browser);
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Setting the weights through ranking': function(browser) {
    browser
      .click('#ranking-button')
      .waitForElementVisible('#ranking-title-header')
      .click('#ranking-option-0')
      .click('#next-button')
      .click('#ranking-option-0')
      .click('#save-button');

    matchImportanceColumnContents(browser, 1, 2, 3);
    resetWeights(browser);
  },

  'Ranking previous button': function(browser) {
    browser
      .click('#ranking-button')
      .waitForElementVisible('#ranking-title-header')
      .click('#ranking-option-0')
      .click('#next-button')
      .click('#previous-button')
      .assert.containsText('#ranking-title-header', 'Ranking (1/2)');
  },

  'Matching previous button': function(browser) {
    browser
      .click('#matching-button')
      .waitForElementVisible('#matching-title-header')
      .click('#matching-option-0')
      .click('#next-button')
      .click('#previous-button')
      .assert.containsText('#matching-title-header', 'Matching (1/2)');
  },

  'Setting the weights through precise swing weighting': function(browser) {
    browser
      .click('#precise-swing-button')
      .waitForElementVisible('#swing-weighting-title-header')
      .click('#swing-option-0')
      .click('#next-button')
      .click('#save-button');

    matchImportanceColumnContents(browser, '100%', '100%', '100%');
    resetWeights(browser);
  },

  'Precise swing previous button': function(browser) {
    browser
      .click('#precise-swing-button')
      .waitForElementVisible('#swing-weighting-title-header')
      .click('#swing-option-0')
      .click('#next-button')
      .click('#previous-button')
      .assert.containsText('#swing-weighting-title-header', 'Precise swing weighting (1/2)');
  },

  'Setting the weights through imprecise swing weighting': function(browser) {
    browser
      .click('#imprecise-swing-button')
      .waitForElementVisible('#swing-weighting-title-header')
      .click('#swing-option-0')
      .click('#next-button')
      .click('#save-button');

    matchImportanceColumnContents(browser, '100%', '1-100%', '1-100%');
    resetWeights(browser);
  },

  'Imprecise swing previous button': function(browser) {
    browser
      .click('#imprecise-swing-button')
      .waitForElementVisible('#swing-weighting-title-header')
      .click('#swing-option-0')
      .click('#next-button')
      .click('#previous-button')
      .assert.containsText('#swing-weighting-title-header', 'Imprecise swing weighting (1/2)');
  },

  'Interacting with Willingness to trade off plot': function(browser) {
    const outcomeValue = 60;

    browser.useXpath();
    browser.expect.element('//*[@id="first-criterion-outcome-input"]').to.not.have.value.which.contains('.');
    browser.expect.element('//*[@id="second-criterion-outcome-input"]').to.not.have.value.which.contains('.');
    browser
      .waitForElementVisible('//willingness-to-trade-off-chart/div/div[1]/div')
      .getLocationInView('//willingness-to-trade-off-chart/div/div[1]/div')
      .moveToElement('//willingness-to-trade-off-chart/div/div[1]/div', 180, 170)
      .mouseButtonDown(0)
      .mouseButtonUp(0)
      ;

    browser.expect.element('//*[@id="first-criterion-outcome-input"]').to.have.value.which.contains('.');
    browser.expect.element('//*[@id="second-criterion-outcome-input"]').to.have.value.which.contains('.');

    browser
      .waitForElementVisible('//*[@id="first-criterion-outcome-b-input"]')
      .waitForElementVisible('//*[@id="second-criterion-outcome-b-input"]')
      .waitForElementVisible('//*[@id="willingness-summary"]')
      .waitForElementVisible('//*[@id="willingness-slider"]')
      .clearValue('//*[@id="first-criterion-outcome-b-input"]')
      .setValue('//*[@id="first-criterion-outcome-b-input"]', outcomeValue)
      .pause(500)
      .assert.containsText('//willingness-to-trade-off-chart/div/div[2]/div/span[10]', outcomeValue)
      .useCss()
      ;
  }
};

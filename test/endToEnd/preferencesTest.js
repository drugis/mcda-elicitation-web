'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = require('./util/constants').testUrl;

function loadTestWorkspace(browser, title) {
  workspaceService.addExample(browser, title);
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
    .assert.containsText('#OS-ranking', '?')
    .assert.containsText('#severe-ranking', '?')
    .assert.containsText('#moderate-ranking', '?')
    ;
}

function matchImportanceColumnContents(browser, value1, value2, value3) {
  browser
    .waitForElementVisible('#trade-off-block')
    .assert.containsText('#OS-ranking', value1)
    .assert.containsText('#severe-ranking', value2)
    .assert.containsText('#moderate-ranking', value3)
    ;
}

const title = 'GetReal course LU 4, activity 4.4';
module.exports = {
  beforeEach: function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  // 'Setting the weights through ranking': function(browser) {
  //   browser
  //     .click('#ranking-button')
  //     .waitForElementVisible('#ranking-title-header')
  //     .click('#OS-ranking-option')
  //     .click('#next-button')
  //     .click('#severe-ranking-option')
  //     .click('#save-button');

  //   matchImportanceColumnContents(browser, 1, 2, 3);
  //   resetWeights(browser);
  // },

  // 'Ranking previous button': function(browser) {
  //   browser
  //     .click('#ranking-button')
  //     .waitForElementVisible('#ranking-title-header')
  //     .click('#OS-ranking-option')
  //     .click('#next-button')
  //     .click('#previous-button')
  //     .assert.containsText('#ranking-title-header', 'Ranking (1/2)');
  // },

  // 'Setting the weights through matching': function(browser) {
  //   browser
  //     .click('#matching-button')
  //     .waitForElementVisible('#matching-title-header')
  //     .click('#OS-option')
  //     .click('#next-button')
  //     .click('#severe-importance-option')
  //     .moveToElement('#elicitation-trade-off-button', 0, 0)
  //     .pause(500)
  //     .click('#elicitation-trade-off-button')
  //     .pause(500)
  //     .click('#save-matching-weights-button')
  //     .assert.containsText('#severe-importance-option', '100%')
  //     .click('#moderate-importance-option')
  //     .moveToElement('#elicitation-trade-off-button', 0, 0)
  //     .pause(500)
  //     .click('#elicitation-trade-off-button')
  //     .pause(500)
  //     .click('#save-matching-weights-button')
  //     .assert.containsText('#moderate-importance-option', '100%')
  //     .click('#save-button');

  //   matchImportanceColumnContents(browser, '100%', '100%', '100%');
  //   resetWeights(browser);
  // },

  // 'Matching previous button': function(browser) {
  //   browser
  //     .click('#matching-button')
  //     .waitForElementVisible('#matching-title-header')
  //     .click('#OS-option')
  //     .click('#next-button')
  //     .click('#previous-button')
  //     .assert.containsText('#matching-title-header', 'Matching (1/2)');
  // },

  // 'Setting the weights through precise swing weighting': function(browser) {
  //   browser
  //     .click('#precise-swing-button')
  //     .waitForElementVisible('#swing-weighting-title-header')
  //     .click('#OS-option')
  //     .click('#next-button')
  //     .click('#save-button');

  //   matchImportanceColumnContents(browser, '100%', '100%', '100%');
  //   resetWeights(browser);
  // },

  // 'Precise swing previous button': function(browser) {
  //   browser
  //     .click('#precise-swing-button')
  //     .waitForElementVisible('#swing-weighting-title-header')
  //     .click('#OS-option')
  //     .click('#next-button')
  //     .click('#previous-button')
  //     .assert.containsText('#swing-weighting-title-header', 'Precise swing weighting (1/2)');
  // },

  // 'Setting the weights through imprecise swing weighting': function(browser) {
  //   browser
  //     .click('#imprecise-swing-button')
  //     .waitForElementVisible('#swing-weighting-title-header')
  //     .click('#OS-option')
  //     .click('#next-button')
  //     .click('#save-button');

  //   matchImportanceColumnContents(browser, '100%', '1-100%', '1-100%');
  //   resetWeights(browser);
  // },

  // 'Imprecise swing previous button': function(browser) {
  //   browser
  //     .click('#imprecise-swing-button')
  //     .waitForElementVisible('#swing-weighting-title-header')
  //     .click('#OS-option')
  //     .click('#next-button')
  //     .click('#previous-button')
  //     .assert.containsText('#swing-weighting-title-header', 'Imprecise swing weighting (1/2)');
  // },

  'Interacting with Willingness to trade off plot': function(browser) {
    const outcomeValue = 60;

    browser.useXpath();
    browser.expect.element('//*[@id="first-criterion-outcome-input"]').to.not.have.value.which.contains('.');
    browser.expect.element('//*[@id="second-criterion-outcome-input"]').to.not.have.value.which.contains('.');
    browser
      .waitForElementVisible('//willingness-to-trade-off-chart/div/div[1]/div')
      .getLocationInView('//willingness-to-trade-off-chart/div/div[1]/div')
      .moveToElement('//willingness-to-trade-off-chart/div/div[1]/div', 0, 0)
      .mouseButtonDown(0)
      .mouseButtonUp(0)
      ;

    browser.expect.element('//*[@id="first-criterion-outcome-input"]').to.have.value.which.contains('.');
    browser.expect.element('//*[@id="second-criterion-outcome-input"]').to.have.value.which.contains('.');

    browser
      .waitForElementVisible('//*[@id="first-criterion-outcome-b-input"]')
      .waitForElementVisible('//*[@id="second-criterion-outcome-b-input"]')
      .waitForElementVisible('//*[@id="willingness-summary"]')
      .waitForElementVisible('//*[@id="willingness-slider"]');

    browser.expect.element('//*[@id="first-criterion-outcome-b-input"]').to.have.value.which.contains('45');
    browser.expect.element('//*[@id="second-criterion-outcome-b-input"]').to.have.value.which.contains('.');

    browser
      .setValue('//*[@id="first-criterion-outcome-b-input"]', outcomeValue)
      .assert.containsText('//*[@id="first-criterion-outcome-b-input"]', outcomeValue)
      .assert.containsText('//*[@id="willingness-slider"]/div/span[10]', outcomeValue)
      .useCss()
      ;
  },
};

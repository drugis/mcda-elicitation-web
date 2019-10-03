'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

const testUrl = 'http://localhost:3002';

function loadTestWorkspace(browser, title) {
  workspaceService.addExample(browser, title);
  browser
    .click('a[id="' + title + '"]')
    .waitForElementVisible('#workspace-title')
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block')
    ;
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
    .assert.containsText('#OS-ranking', value1)
    .assert.containsText('#severe-ranking', value2)
    .assert.containsText('#moderate-ranking', value3)
    ;
}

module.exports = {
  'Setting the weights through ranking': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .click('#ranking-button')
      .waitForElementVisible('#ranking-title-header')
      .click('#OS-ranking-option')
      .click('#next-button')
      .click('#severe-ranking-option')
      .click('#save-button');

    matchImportanceColumnContents(browser, 1, 2, 3);
    resetWeights(browser);
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Setting the weights through matching': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .click('#matching-button')
      .waitForElementVisible('#matching-title-header')
      .click('#OS-option')
      .click('#next-button')
      .click('#severe-importance-option')
      .click('#elicitation-trade-off-button')
      .click('#save-matching-weights-button')
      .click('#moderate-importance-option')
      .click('#elicitation-trade-off-button')
      .click('#save-matching-weights-button')
      .click('#save-button');

    matchImportanceColumnContents(browser, '100%', '100%', '100%');
    resetWeights(browser);
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Setting the weights through precise swing weighting': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .click('#precise-swing-button')
      .waitForElementVisible('#swing-weighting-title-header')
      .click('#OS-option')
      .click('#next-button')
      .click('#save-button');

    matchImportanceColumnContents(browser, '100%', '100%', '100%');
    resetWeights(browser);
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Setting the weights through imprecise swing weighting': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .click('#imprecise-swing-button')
      .waitForElementVisible('#swing-weighting-title-header')
      .click('#OS-option')
      .click('#next-button')
      .click('#save-button');

    matchImportanceColumnContents(browser, '100%', '1-100%', '1-100%');
    resetWeights(browser);
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },
};
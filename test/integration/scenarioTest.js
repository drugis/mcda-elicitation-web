'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = 'http://localhost:3002';

function loadTestWorkspace(browser, title) {
  workspaceService.addExample(browser, title);
  browser
    .click('a[id="' + title + '"]')
    .waitForElementVisible('#workspace-title');

  errorService.isErrorBarHidden(browser);

  browser
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

module.exports = {
  'Creating a new scenario': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';
    const scenarioTitle = 'scenario title';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .click('#create-scenario-button')
      .waitForElementVisible('#create-new-scenario-button:disabled')
      .setValue('#new-scenario-title', 'Default')
      .waitForElementVisible('#create-new-scenario-button:disabled')
      .waitForElementVisible('#duplicate-title-alert')
      .clearValue('#new-scenario-title')
      .setValue('#new-scenario-title', scenarioTitle)
      .waitForElementVisible('#create-new-scenario-button:enabled')
      .click('#create-new-scenario-button')
      .pause(50)
      .assert.containsText('#scenario-selector', scenarioTitle)
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Editing the title': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';
    const newTitle = 'scenario title';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .click('#edit-scenario-button')
      .clearValue('#new-scenario-title')
      .setValue('#new-scenario-title', newTitle)
      .click('#edit-scenario-title-button')
      .pause(50)
      .waitForElementVisible('#scenario-selector')
      .assert.containsText('#scenario-selector', newTitle)
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Copying the scenario': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';
    const newTitle = 'scenario title';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .assert.containsText('#scenario-selector', 'Default')
      .click('#copy-scenario-button')
      .waitForElementVisible('#create-new-scenario-button:disabled')
      .setValue('#new-scenario-title', newTitle)
      .waitForElementVisible('#create-new-scenario-button:enabled')
      .click('#create-new-scenario-button')
      .pause(50) //pause needed to not get 'stale element' error
      .waitForElementVisible('#scenario-selector')
      .assert.containsText('#scenario-selector', newTitle)
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Switching scenario': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';
    const scenarioTitle = 'scenario title';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .click('#create-scenario-button')
      .setValue('#new-scenario-title', scenarioTitle)
      .waitForElementVisible('#create-new-scenario-button:enabled')
      .click('#create-new-scenario-button')
      .pause(50)
      .assert.containsText('#scenario-selector', scenarioTitle)
      .click('#scenario-selector')
      .click('option[label="Default"]')
      .assert.containsText('#scenario-selector', 'Default')
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },
};
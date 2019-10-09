'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = 'http://localhost:3002';
const title = 'GetReal course LU 4, activity 4.4';
const scenarioTitle = 'scenario title';

module.exports = {
  beforeEach: function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title');

    errorService.isErrorBarHidden(browser);

    browser
      .click('#preferences-tab')
      .waitForElementVisible('#partial-value-functions-block');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Creating a new scenario': function(browser) {
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
  },

  'Editing the title': function(browser) {
    browser
      .click('#edit-scenario-button')
      .clearValue('#new-scenario-title')
      .setValue('#new-scenario-title', scenarioTitle)
      .click('#edit-scenario-title-button')
      .pause(50)
      .waitForElementVisible('#scenario-selector')
      .assert.containsText('#scenario-selector', scenarioTitle)
      ;
  },

  'Copying the scenario': function(browser) {
    browser
      .assert.containsText('#scenario-selector', 'Default')
      .click('#copy-scenario-button')
      .waitForElementVisible('#create-new-scenario-button:disabled')
      .setValue('#new-scenario-title', scenarioTitle)
      .waitForElementVisible('#create-new-scenario-button:enabled')
      .click('#create-new-scenario-button')
      .pause(50) //pause needed to not get 'stale element' error
      .waitForElementVisible('#scenario-selector')
      .assert.containsText('#scenario-selector', scenarioTitle)
      ;
  },

  'Switching scenario in the preferences tab': function(browser) {
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
  },

  'Switching scenario in the deterministic results tab': function(browser) {
    browser
      .click('#create-scenario-button')
      .setValue('#new-scenario-title', scenarioTitle)
      .waitForElementVisible('#create-new-scenario-button:enabled')
      .click('#create-new-scenario-button')
      .pause(50)
      .assert.containsText('#scenario-selector', scenarioTitle)
      .click('#deterministic-tab')
      .waitForElementVisible('#sensitivity-measurements-header')
      .click('#scenario-selector')
      .click('option[label="Default"]')
      .assert.containsText('#scenario-selector', 'Default')
      ;
  },

  'Switching scenario in the SMAA results tab': function(browser) {
    browser
      .click('#create-scenario-button')
      .setValue('#new-scenario-title', scenarioTitle)
      .waitForElementVisible('#create-new-scenario-button:enabled')
      .click('#create-new-scenario-button')
      .pause(50)
      .assert.containsText('#scenario-selector', scenarioTitle)
      .click('#smaa-tab')
      .waitForElementVisible('#smaa-measurements-header')
      .click('#scenario-selector')
      .click('option[label="Default"]')
      .assert.containsText('#scenario-selector', 'Default')
      ;
  }
};

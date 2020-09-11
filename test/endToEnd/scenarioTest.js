'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Creating a new scenario': create,
  'Editing the title': edit,
  'Copying the scenario': copy,
  'Switching scenario in the preferences tab': switchinPreferences,
  'Switching scenario in the deterministic results tab': switchInDeterministic,
  'Switching scenario in the SMAA results tab': switchInSmaa,
  'Delete scenario': deleteScenario,
  'Cancel deleting': cancelDeleteScenario
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
const scenarioTitle = 'scenario title';

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');

  errorService
    .isErrorBarHidden(browser)
    .click('#preferences-tab')
    .pause(50)
    .waitForElementVisible('#partial-value-functions-block');
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function create(browser) {
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
    .assert.containsText('#scenario-selector', scenarioTitle);
}

function edit(browser) {
  browser
    .waitForElementVisible('#edit-scenario-button')
    .click('#edit-scenario-button')
    .clearValue('#new-scenario-title')
    .pause(250)
    .setValue('#new-scenario-title', scenarioTitle)
    .pause(250)
    .click('#edit-scenario-title-button')
    .waitForElementVisible('#scenario-selector')
    .assert.containsText('#scenario-selector', scenarioTitle);
}

function copy(browser) {
  browser.assert
    .containsText('#scenario-selector', 'Default')
    .click('#copy-scenario-button')
    .waitForElementVisible('#create-new-scenario-button:disabled')
    .setValue('#new-scenario-title', scenarioTitle)
    .waitForElementVisible('#create-new-scenario-button:enabled')
    .click('#create-new-scenario-button')
    .pause(50) //pause needed to not get 'stale element' error
    .waitForElementVisible('#scenario-selector')
    .assert.containsText('#scenario-selector', scenarioTitle);
}

function switchinPreferences(browser) {
  browser
    .click('#create-scenario-button')
    .setValue('#new-scenario-title', scenarioTitle)
    .waitForElementVisible('#create-new-scenario-button:enabled')
    .click('#create-new-scenario-button')
    .pause(50)
    .assert.containsText('#scenario-selector', scenarioTitle)
    .click('#scenario-selector')
    .click('option[label="Default"]')
    .assert.containsText('#scenario-selector', 'Default');
}

function switchInDeterministic(browser) {
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
    .assert.containsText('#scenario-selector', 'Default');
}

function switchInSmaa(browser) {
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
    .assert.containsText('#scenario-selector', 'Default');
}
function deleteScenario(browser) {
  browser
    .waitForElementVisible('#delete-scenario-disabled')
    .assert.containsText('#scenario-selector', 'Default')
    .click('#copy-scenario-button')
    .waitForElementVisible('#create-new-scenario-button:disabled')
    .setValue('#new-scenario-title', scenarioTitle)
    .waitForElementVisible('#create-new-scenario-button:enabled')
    .click('#create-new-scenario-button')
    .pause(50) //pause needed to not get 'stale element' error
    .waitForElementVisible('#delete-scenario-button')
    .assert.containsText('#scenario-selector', scenarioTitle)
    .click('#delete-scenario-button')
    .waitForElementVisible('#delete-scenario-header')
    .click('#delete-scenario-confirm-button')
    .waitForElementVisible('#delete-scenario-disabled')
    .assert.containsText('#scenario-selector', 'Default');
}

function cancelDeleteScenario(browser) {
  browser
    .waitForElementVisible('#delete-scenario-disabled')
    .assert.containsText('#scenario-selector', 'Default')
    .click('#copy-scenario-button')
    .waitForElementVisible('#create-new-scenario-button:disabled')
    .setValue('#new-scenario-title', scenarioTitle)
    .waitForElementVisible('#create-new-scenario-button:enabled')
    .click('#create-new-scenario-button')
    .pause(50) //pause needed to not get 'stale element' error
    .click('#delete-scenario-button')
    .waitForElementVisible('#delete-scenario-header')
    .click('#close-modal-button')
    .waitForElementVisible('#delete-scenario-button')
    .assert.containsText('#scenario-selector', scenarioTitle);
}

'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Create subproblem': create,
  'Switching between subproblems': switchSubproblem,
  'Edit the title': edit,
  'Reset during subproblem creation': reset,
  'Interact with scale sliders': changeScale,
  'Deleting': deleteSubproblem,
  'Cancel deleting': cancelDeleteSubproblem,
  'Create non-analyzable problem': createNonAnalyzableProblem
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const subproblem1 = {
  title: 'subproblem1'
};

function setupSubProblem(browser) {
  browser
    .waitForElementVisible('#effects-table-header')
    .click('#create-subproblem-button')
    .waitForElementVisible('#create-subproblem-header')
    .waitForElementVisible('#create-new-subproblem-button:disabled')
    .assert.containsText('#no-title-warning', 'No title entered')
    .assert.containsText('#scale-blocking-warning-0', 'Effects table contains missing values, therefore no scales can be set and this problem cannot be analyzed.')
    .assert.containsText('#scale-blocking-warning-1', 'Effects table contains multiple data sources per criterion, therefore no scales can be set and this problem cannot be analyzed.')
    .setValue('#subproblem-title', subproblem1.title)
    .waitForElementVisible('#create-new-subproblem-button:enabled')
    .click('#alternative-2')
    .click('#datasource-1')
    .click('#criterion-3');
  return browser;
}

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(browser, '/createSubproblemTestProblem.json');
  util.delayedClick(browser, '#problem-definition-tab', '#effects-table-header');
}

function afterEach(browser) {
  errorService.isErrorBarHidden(browser);
  util.delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService
    .deleteFromList(browser, 0)
    .end();
}

function create(browser) {
  setupSubProblem(browser)
    .click('#create-new-subproblem-button');
}

function switchSubproblem(browser) {
  setupSubProblem(browser)
    .waitForElementVisible('#create-new-subproblem-button:enabled')
    .click('#create-new-subproblem-button')
    .assert.containsText('#subproblem-selector', subproblem1.title)
    .click('#subproblem-selector')
    .click('option[label="Default"]')
    .assert.containsText('#subproblem-selector', 'Default');
}

function edit(browser) {
  const newTitle = 'not default';
  browser
    .waitForElementVisible('#effects-table-header')
    .click('#edit-subproblem-button')
    .clearValue('#subproblem-title-input')
    .waitForElementVisible('#save-subproblem-button:disabled')
    .setValue('#subproblem-title-input', newTitle)
    .click('#save-subproblem-button')
    .waitForElementVisible('#effects-table-header')
    .assert.containsText('#subproblem-selector', newTitle);
}

function reset(browser) {
  setupSubProblem(browser)
    .click('#reset-subproblem-button')
    .waitForElementVisible('#create-new-subproblem-button:disabled')
    .assert.containsText('#subproblem-title', '')
    .waitForElementVisible('#alternative-2:checked')
    .waitForElementVisible('#datasource-1:checked')
    .waitForElementVisible('#criterion-3:checked')
    .click('#close-modal-button');
}

function changeScale(browser) {
  const lowerValueLabel = '//*[@id="slider-0"]/div/span[10]';
  const upperValueLabel = '//*[@id="slider-0"]/div/span[11]';
  const moveFloor = '//*[@id="slider-0-floor"]';
  const moveCeil = '//*[@id="slider-0-ceil"]';
  const floorLabel = '//*[@id="slider-0"]/div/span[8]';
  const ceilLabel = '//*[@id="slider-0"]/div/span[9]';
  const moveLowerValue = '//*[@id="slider-0"]/div/span[6]';
  const moveUpperValue = '//*[@id="slider-0"]/div/span[7]';

  setupSubProblem(browser)
    .useXpath()
    .assert.containsText(lowerValueLabel, '-200')
    .assert.containsText(upperValueLabel, '200')
    .click(moveFloor)
    .click(moveCeil)
    .assert.containsText(floorLabel, '-300')
    .assert.containsText(ceilLabel, '300')
    .moveToElement(moveLowerValue, 0, 0)
    .mouseButtonDown(0)
    .moveToElement(moveFloor, 0, 0)
    .mouseButtonUp(0)
    .assert.containsText(lowerValueLabel, '-300')
    .moveToElement(moveUpperValue, 0, 0)
    .mouseButtonDown(0)
    .moveToElement(moveCeil, 0, 0)
    .mouseButtonUp(0)
    .assert.containsText(upperValueLabel, '300')
    .useCss()
    .click('#close-modal-button');
}

function deleteSubproblem(browser) {
  browser.waitForElementVisible('#delete-subproblem-disabled');
  setupSubProblem(browser)
    .click('#create-new-subproblem-button')
    .waitForElementVisible('#delete-subproblem-button')
    .click('#delete-subproblem-button')
    .waitForElementVisible('#delete-subproblem-header')
    .click('#delete-subproblem-confirm-button')
    .waitForElementVisible('#workspace-title')
    .waitForElementVisible('#delete-subproblem-disabled')
    .assert.containsText('#subproblem-selector', 'Default');
}

function cancelDeleteSubproblem(browser) {
  browser.waitForElementVisible('#delete-subproblem-disabled');
  setupSubProblem(browser)
    .click('#create-new-subproblem-button')
    .click('#delete-subproblem-button')
    .waitForElementVisible('#delete-subproblem-header')
    .click('#close-modal-button')
    .waitForElementVisible('#delete-subproblem-button')
    .assert.containsText('#subproblem-selector', subproblem1.title);
}

function createNonAnalyzableProblem(browser) {
  setupSubProblem(browser)
    .click('#datasource-1')
    .click('#create-new-subproblem-button')
    .waitForElementVisible('#no-scales-warning-0');
}

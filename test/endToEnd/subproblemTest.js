'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Create subproblem': create,
  'Switching between subproblems': switchSubproblem,
  'Edit the title': edit,
  'Reset during subproblem creation': resetAndDuplicateTitle,
  'Interact with scale sliders': changeScale,
  Deleting: deleteSubproblem,
  'Deleting the default subproblem': deleteDefaultSubproblem,
  'Cancel deleting': cancelDeleteSubproblem,
  'Create non-analyzable problem': createNonAnalyzableProblem
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');
const alternative2checkbox =
  '#inclusion-785c281d-c66a-48a7-8cfa-4aeb8899a2b7-checkbox';
const subproblem1 = {
  title: 'subproblem1'
};

function setupSubProblem(browser) {
  browser
    .waitForElementVisible('#effects-table-header')
    .click('#add-subproblem-button')
    .waitForElementVisible('#add-subproblem-header')
    .waitForElementVisible('#add-subproblem-confirm-button:enabled')
    .assert.containsText(
      '#scale-ranges-warning-0',
      'Effects table contains missing values'
    )
    .assert.containsText(
      '#scale-ranges-warning-1',
      'Effects table contains multiple data sources per criterion'
    )
    .clearValue('#subproblem-title-input')
    .setValue('#subproblem-title-input', subproblem1.title)
    .waitForElementVisible('#add-subproblem-confirm-button:enabled')
    .click(alternative2checkbox)
    .click('#inclusion-deselectionDataSourceId-checkbox')
    .assert.not.elementPresent('#scale-ranges-warning-1')
    .click('#inclusion-deselectionCriterionId-checkbox')
    .assert.not.elementPresent('#scale-ranges-warning-0');
  return browser;
}

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(
    browser,
    '/createSubproblemTestProblem.json'
  );
  util.delayedClick(
    browser,
    '#problem-definition-tab',
    '#effects-table-header'
  );
}

function afterEach(browser) {
  errorService.isErrorBarHidden(browser);
  util.delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function create(browser) {
  setupSubProblem(browser)
    .click('#add-subproblem-confirm-button')
    .assert.not.elementPresent('#column-alternative-2')
    .assert.not.elementPresent('#unit-cell-deselectionDataSourceId')
    .assert.not.elementPresent('#criterion-row-deselectionCriterionId')
    .waitForElementVisible('#scales-table');
}

function switchSubproblem(browser) {
  setupSubProblem(browser)
    .waitForElementVisible('#add-subproblem-confirm-button:enabled')
    .click('#add-subproblem-confirm-button')
    .assert.containsText('#subproblem-selector', subproblem1.title)
    .click('#subproblem-selector')
    .click('#subproblem-selector > option:nth-child(1)')
    .assert.containsText('#subproblem-selector', 'Default');
}

function edit(browser) {
  const newTitle = 'not default';
  browser
    .waitForElementVisible('#effects-table-header')
    .click('#edit-subproblem-button')
    .clearValue('#subproblem-title-input')
    .waitForElementVisible('#edit-subproblem-confirm-button:disabled')
    .setValue('#subproblem-title-input', newTitle)
    .click('#edit-subproblem-confirm-button')
    .waitForElementVisible('#effects-table-header')
    .assert.containsText('#subproblem-selector', newTitle);
}

function resetAndDuplicateTitle(browser) {
  setupSubProblem(browser)
    .clearValue('#subproblem-title-input')
    .setValue('#subproblem-title-input', 'Default')
    .waitForElementVisible('#error-0')
    .click('#reset-subproblem-button')
    .waitForElementVisible('#add-subproblem-confirm-button:enabled')
    .waitForElementVisible('#add-subproblem-confirm-button:disabled')
    .expect.element(alternative2checkbox)
    .to.be.selected.expect.element(
      '#inclusion-deselectionDataSourceId-checkbox'
    )
    .to.be.selected.expect.element('#inclusion-deselectionCriterionId-checkbox')
    .to.be.selected.click('#close-modal-button');
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
  browser.waitForElementVisible('#delete-subproblem-button:disabled');
  setupSubProblem(browser)
    .click('#add-subproblem-confirm-button')
    .waitForElementVisible('#delete-subproblem-button')
    .click('#delete-subproblem-button')
    .waitForElementVisible('#delete-subproblem-header')
    .pause(5000) //needed for the test to pass on github
    .click('#delete-subproblem-confirm-button')
    .waitForElementVisible('#delete-subproblem-button:disabled')
    .assert.containsText('#subproblem-selector', 'Default');
}

function deleteDefaultSubproblem(browser) {
  browser.waitForElementVisible('#delete-subproblem-button:disabled');
  setupSubProblem(browser)
    .click('#add-subproblem-confirm-button')
    .assert.containsText('#subproblem-selector', subproblem1.title)
    .click('#subproblem-selector')
    .click('#subproblem-selector > option:nth-child(1)')
    .assert.containsText('#subproblem-selector', 'Default')
    .waitForElementVisible('#delete-subproblem-button')
    .click('#delete-subproblem-button')
    .waitForElementVisible('#delete-subproblem-header')
    .pause(5000) //needed for the test to pass on github
    .click('#delete-subproblem-confirm-button')
    .waitForElementVisible('#delete-subproblem-button:disabled')
    .assert.containsText('#subproblem-selector', subproblem1.title);
}

function cancelDeleteSubproblem(browser) {
  browser.waitForElementVisible('#delete-subproblem-button:disabled');
  setupSubProblem(browser)
    .click('#add-subproblem-confirm-button')
    .click('#delete-subproblem-button')
    .waitForElementVisible('#delete-subproblem-header')
    .click('#close-modal-button')
    .waitForElementVisible('#delete-subproblem-button')
    .assert.containsText('#subproblem-selector', subproblem1.title);
}

function createNonAnalyzableProblem(browser) {
  setupSubProblem(browser)
    .click('#datasource-1')
    .click('#add-subproblem-confirm-button')
    .waitForElementVisible('#no-scales-warning-0');
}

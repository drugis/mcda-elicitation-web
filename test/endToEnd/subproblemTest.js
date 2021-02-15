'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Create subproblem and get results': create,
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
const alternative2checkbox = '#inclusion-alt2Id-checkbox';
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

  util.delayedClick(
    browser,
    '#preferences-tab',
    '#partial-value-functions-header'
  );

  browser
    .waitForElementVisible('#pvf-questionmark-crit1Id')
    .waitForElementVisible('#pvf-questionmark-crit2Id')
    .click('#increasing-pvf-button-crit1Id')
    .waitForElementVisible('#pvfplot-crit1Id')
    .click('#decreasing-pvf-button-crit1Id')
    .waitForElementVisible('#pvfplot-crit1Id')
    .click('#decreasing-pvf-button-crit2Id')
    .waitForElementVisible('#pvfplot-crit2Id');

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

  util.delayedClick(browser, '#smaa-tab', '#effects-table-header');
  browser
    .waitForElementVisible('#effects-table')
    .waitForElementVisible('#rank-acceptabilities-plot')
    .waitForElementVisible('#rank-acceptabilities-table')
    .waitForElementVisible('#central-weights-plot')
    .waitForElementVisible('#central-weights-table');
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
    .assert.containsText('#subproblem-selector', newTitle)
    .click('#edit-subproblem-button')
    .click('#edit-subproblem-confirm-button');
}

function resetAndDuplicateTitle(browser) {
  setupSubProblem(browser)
    .clearValue('#subproblem-title-input')
    .setValue('#subproblem-title-input', 'Default')
    .waitForElementVisible('#add-subproblem-error-0')
    .waitForElementVisible('#add-subproblem-confirm-button:disabled')
    .click('#reset-subproblem-button')
    .waitForElementVisible('#add-subproblem-confirm-button:enabled')
    .expect.element(alternative2checkbox).to.be.selected;
  browser.expect.element('#inclusion-deselectionDataSourceId-checkbox').to.be
    .selected;
  browser.expect.element('#inclusion-deselectionCriterionId-checkbox').to.be
    .selected;
  browser
    .waitForElementVisible('#close-modal-button')
    .click('#close-modal-button');
}

function changeScale(browser) {
  const lowerValueLabel = '//*[@id="slider-crit1Id"]/span[9]/span/span/span';
  const upperValueLabel = '//*[@id="slider-crit1Id"]/span[10]/span/span/span';
  const floorLabel = '//*[@id="slider-crit1Id"]/span[4]';
  const ceilLabel = '//*[@id="slider-crit1Id"]/span[8]';
  const moveFloor = '//*[@id="extend-from-crit1Id"]';
  const moveCeil = '//*[@id="extend-to-crit1Id"]';
  const stepSizeSelector = '//*[@id="step-size-selector-crit1Id"]';

  setupSubProblem(browser)
    .useXpath()
    .assert.containsText(lowerValueLabel, '-200')
    .assert.containsText(upperValueLabel, '200')
    .click(moveFloor)
    .click(moveCeil)
    .assert.containsText(floorLabel, '-400')
    .assert.containsText(ceilLabel, '500')
    .moveToElement(lowerValueLabel, 0, 0)
    .mouseButtonDown(0)
    .moveToElement(moveFloor, 0, 0)
    .mouseButtonUp(0)
    .assert.containsText(lowerValueLabel, '-400')
    .moveToElement(upperValueLabel, 0, 0)
    .mouseButtonDown(0)
    .moveToElement(moveCeil, 0, 0)
    .mouseButtonUp(0)
    .assert.containsText(upperValueLabel, '500')
    .assert.containsText(stepSizeSelector, '10')
    .click(stepSizeSelector)
    .assert.containsText(stepSizeSelector + '/option[1]', '100')
    .assert.containsText(stepSizeSelector + '/option[2]', '10')
    .assert.containsText(stepSizeSelector + '/option[3]', '1')
    .click(stepSizeSelector + '/option[3]')
    .assert.containsText(stepSizeSelector, '1')
    .useCss()
    .click('#close-modal-button');
}

function deleteSubproblem(browser) {
  browser.waitForElementVisible('#delete-subproblem-button:disabled');
  setupSubProblem(browser)
    .click('#add-subproblem-confirm-button')
    .pause(1000) //wait for page reload to be done
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
    .pause(1000)
    .click('#delete-subproblem-button')
    .waitForElementVisible('#delete-subproblem-header')
    .click('#close-modal-button')
    .waitForElementVisible('#delete-subproblem-button')
    .assert.containsText('#subproblem-selector', subproblem1.title);
}

function createNonAnalyzableProblem(browser) {
  setupSubProblem(browser)
    .click('#inclusion-deselectionDataSourceId-checkbox')
    .click('#add-subproblem-confirm-button')
    .pause(1000) //wait for page reload
    .waitForElementVisible('#no-scales-warning-0');
}

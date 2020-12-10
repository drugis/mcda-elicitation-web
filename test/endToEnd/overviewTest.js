'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'The overview tab': assertContents,
  'Editing the therapeutic context': editTherapeuticContext,
  'Editing a criterion': editCriterion,
  'Editing a criterion and switching tabs': editCriterionSwitchTabs,
  'Editing a data source': editDataSource,
  'Editing an alternative': editAlternative,
  'Editing the workspace title': editTitle,
  'Reordering criteria': reorderCriteria,
  'Reordering alternatives': reorderAlternatives,
  'Reordering data sources': reorderDataSources
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const title = 'Thrombolytics - single study B/R analysis';
const proximalDVTCriterionTitle = '#criterion-title-proximalId';
const proximalDVTCriterionDescription = '#criterion-description-proximalId';
const heparinAlternative = '#alternative-title-heparinId';

function loadTestWorkspace(browser, title) {
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');
  return errorService.isErrorBarHidden(browser);
}

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
}

function afterEach(browser) {
  util.delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function assertContents(browser) {
  const firstDistalDVTValue = '#value-cell-distalDsId-heparinId';

  loadTestWorkspace(browser, title)
    .assert.containsText('#therapeutic-context', 'No description given.')
    .assert.containsText(proximalDVTCriterionTitle, 'Proximal DVT')
    .assert.containsText(heparinAlternative, 'Heparin')
    .assert.containsText(
      proximalDVTCriterionDescription,
      'Proximal deep vein thrombolytic events, often associated with serious complications.'
    )
    .assert.containsText(firstDistalDVTValue, '29.4');
}

function editTherapeuticContext(browser) {
  loadTestWorkspace(browser, title)
    .assert.containsText('#therapeutic-context', 'No description given.')
    .click('#edit-therapeutic-context-button')
    .waitForElementVisible('#therapeutic-context-header')
    .setValue('#therapeutic-context-input', 'new context')
    .click('#edit-therapeutic-context-confirm-button')
    .assert.containsText('#therapeutic-context', 'new context');
}

function editCriterion(browser) {
  const newTitle = 'new title';
  const newDescription = 'new description';

  loadTestWorkspace(browser, title)
    .click('#edit-criterion-button-proximalId')
    .waitForElementVisible('#criterion-title-input')
    .clearValue('#criterion-title-input')
    .setValue('#criterion-title-input', newTitle)
    .clearValue('#criterion-description-input')
    .setValue('#criterion-description-input', newDescription)
    .click('#edit-criterion-confirm-button')
    .assert.containsText(proximalDVTCriterionTitle, newTitle)
    .assert.containsText(proximalDVTCriterionDescription, newDescription);
}

function editCriterionSwitchTabs(browser) {
  const newTitle = 'new title';

  loadTestWorkspace(browser, title)
    .click('#edit-criterion-button-proximalId')
    .waitForElementVisible('#criterion-title-input')
    .clearValue('#criterion-title-input')
    .setValue('#criterion-title-input', newTitle)
    .click('#edit-criterion-confirm-button')
    .waitForElementVisible('#workspace-title')
    .assert.containsText('#criterion-title-proximalId', newTitle)
    .click('#problem-definition-tab')
    .waitForElementVisible('#effects-table-header')
    .assert.containsText('#criterion-title-proximalId', newTitle);
}

function editDataSource(browser) {
  const zinbryta = 'Zinbryta - initial regulatory review';
  const newUnit = 'new unit';
  const newReference = 'newReference';
  const newUrl = 'www.google.com';
  const newStrength = 'new strength';
  const newUncertainties = 'very uncertain';
  const originalReference = 'Study 205MS301';

  loadTestWorkspace(browser, zinbryta)
    .assert.containsText('#reference-arrDsId', originalReference)
    .assert.containsText('#unit-cell-arrDsId', 'Annual rate')
    .click('#edit-data-source-button-arrDsId')
    .waitForElementVisible('#unit-of-measurement-input')
    .clearValue('#unit-of-measurement-input')
    .setValue('#unit-of-measurement-input', newUnit)

    .clearValue('#reference-input')
    .setValue('#reference-input', newReference)
    .setValue('#reference-link-input', newUrl)

    .clearValue('#strength-of-evidence-input')
    .setValue('#strength-of-evidence-input', newStrength)
    .setValue('#uncertainties-input', newUncertainties)

    .click('#edit-data-source-confirm-button')
    .assert.containsText('#reference-arrDsId', newReference)
    .assert.containsText(
      '#soe-unc-arrDsId',
      'SoE: ' + newStrength + '\nUnc: ' + newUncertainties
    )
    .assert.containsText('#unit-cell-arrDsId', newUnit);
}

function editAlternative(browser) {
  const newTitle = 'new alternative';

  loadTestWorkspace(browser, title)
    .click('#edit-alternative-button-heparinId')
    .waitForElementVisible('#alternative-title-input')
    .clearValue('#alternative-title-input')
    .setValue('#alternative-title-input', newTitle)
    .click('#edit-alternative-confirm-button')
    .assert.containsText(heparinAlternative, newTitle);
}

function editTitle(browser) {
  const newTitle = 'new workspace title';

  loadTestWorkspace(browser, title)
    .click('#edit-workspace-title-button')
    .clearValue('#workspace-title-input')
    .setValue('#workspace-title-input', newTitle)
    .click('#save-workspace-title-button');
}

function reorderCriteria(browser) {
  const firstCriterionTitle = '#criterion-title-proximalId';
  const firstCriterionDown = '#move-down-proximalId';

  loadTestWorkspace(browser, title)
    .click(firstCriterionDown)
    .assert.containsText(firstCriterionTitle, 'Distal DVT')
    .click(firstCriterionDown)
    .assert.containsText(firstCriterionTitle, 'Proximal DVT');
}

function reorderAlternatives(browser) {
  const firstAlternativeTitle = '#alternative-title-heparinId';
  const heparinDown = '#move-down-heparinId';
  const heparinUp = '#move-up-heparinId';

  loadTestWorkspace(browser, title)
    .getLocationInView(heparinDown)
    .waitForElementVisible(heparinDown)
    .click(heparinDown)
    .assert.containsText(firstAlternativeTitle, 'Enoxaparin')
    .click(heparinUp)
    .assert.containsText(firstAlternativeTitle, 'Heparin');
}

function reorderDataSources(browser) {
  workspaceService.uploadTestWorkspace(
    browser,
    '/createSubproblemTestProblem.json'
  );

  const firstReference = '#reference-ds1Id';
  const ref1Down = '#move-down-ds1Id';
  const ref1Up = '#move-up-data-ds1Id';

  browser.assert
    .containsText(firstReference, 'ref1')
    .click(ref1Down)
    .assert.containsText(firstReference, 'ref2')
    .click(ref1Up)
    .assert.containsText(firstReference, 'ref1');
}

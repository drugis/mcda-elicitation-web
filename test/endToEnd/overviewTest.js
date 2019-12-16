'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const title = 'Thrombolytics - single study B/R analysis';
const proximalDVTCriterionTitle = '#criterion-title-0';
const proximalDVTCriterionDescription = '#criterion-description-0';
const heparinAlternative = '#alternative-title-0';

function loadTestWorkspace(browser, title) {
  workspaceService.addExample(browser, title);
  browser
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');

  errorService.isErrorBarHidden(browser);
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser);
  },

  afterEach: function(browser) {
    util.delayedClick(browser, '#logo', '#workspaces-header');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'The overview tab': function(browser) {
    loadTestWorkspace(browser, title);

    const firstDistalDVTValue = '//*[@id="c-1-ds-0-a-0-table-cell"]/effects-table-cell/div/div';

    browser
      .assert.containsText('#therapeutic-context', 'No description given.')
      .assert.containsText(proximalDVTCriterionTitle, 'Proximal DVT')
      .assert.containsText(heparinAlternative, 'Heparin')
      .assert.containsText(proximalDVTCriterionDescription, 'Proximal deep vein thrombolytic events, often associated with serious complications.')
      .useXpath()
      .assert.containsText(firstDistalDVTValue, '40 / 136')
      .useCss();
  },

  'Editing the therapeutic context': function(browser) {
    loadTestWorkspace(browser, title);

    browser
      .assert.containsText('#therapeutic-context', 'No description given.')
      .click('#edit-therapeutic-context-button')
      .waitForElementVisible('#therapeutic-context-header')
      .setValue('#therapeutic-context-input', 'new context')
      .click('#save-button')
      .assert.containsText('#therapeutic-context', 'new context');
  },

  'Editing a criterion': function(browser) {
    loadTestWorkspace(browser, title);

    const newTitle = 'new title';
    const newDescription = 'new description';

    browser
      .click('#edit-criterion-0')
      .waitForElementVisible('#criterion-title-input')
      .clearValue('#criterion-title-input')
      .setValue('#criterion-title-input', newTitle)
      .clearValue('#criterion-description-input')
      .setValue('#criterion-description-input', newDescription)
      .click('#add-criterion-confirm-button')
      .assert.containsText(proximalDVTCriterionTitle, newTitle)
      .assert.containsText(proximalDVTCriterionDescription, newDescription);
  },

  'Editing a data source': function(browser) {
    const zinbryta = 'Zinbryta - initial regulatory review';
    loadTestWorkspace(browser, zinbryta);

    const newUnit = 'new unit';
    const newReference = 'newReference';
    const newUrl = 'www.google.com';
    const newStrength = 'new strength';
    const newUncertainties = 'very uncertain';
    const originalReference = 'Study 205MS301';

    browser
      .assert.containsText('#data-source-reference-0-0', originalReference)
      .assert.containsText('#unit-of-measurement-0-0', 'Annual rate')
      .click('#edit-data-source-0-0')
      .waitForElementVisible('#unit-of-measurement-input')
      .clearValue('#unit-of-measurement-input')
      .setValue('#unit-of-measurement-input', newUnit)

      .clearValue('#reference-input')
      .setValue('#reference-input', newReference)
      .setValue('#reference-link-input', newUrl)

      .clearValue('#strength-of-evidence-input')
      .setValue('#strength-of-evidence-input', newStrength)
      .setValue('#uncertainties-input', newUncertainties)

      .click('#edit-data-source-button')
      .assert.containsText('#linked-data-source-reference-0-0', newReference)
      .assert.containsText('#soe-unc-0-0', 'SoE: ' + newStrength + '\nUnc: ' + newUncertainties)
      .assert.containsText('#unit-of-measurement-0-0', newUnit);
  },

  'Editing an alternative': function(browser) {
    loadTestWorkspace(browser, title);
    const newTitle = 'new alternative';

    browser
      .click('#edit-alternative-0')
      .waitForElementVisible('#alternative-title')
      .clearValue('#alternative-title')
      .setValue('#alternative-title', newTitle)
      .click('#save-alternative-button')
      .assert.containsText(heparinAlternative, newTitle);
  },

  'Editing the workspace title': function(browser) {
    loadTestWorkspace(browser, title);
    const newTitle = 'new workspace title';

    browser
      .click('#edit-workspace-title-button')
      .clearValue('#workspace-title-input')
      .setValue('#workspace-title-input', newTitle)
      .click('#save-workspace-title-button');
  },

  'Reordering criteria': function(browser) {
    loadTestWorkspace(browser, title);

    const firstCriterionTitle = '#criterion-title-0';
    const firstCriterionDown = '#move-down-criterion-0';

    browser
      .click(firstCriterionDown)
      .assert.containsText(firstCriterionTitle, 'Distal DVT')
      .click(firstCriterionDown)
      .assert.containsText(firstCriterionTitle, 'Proximal DVT');
  },

  'Reordering alternatives': function(browser) {
    loadTestWorkspace(browser, title);

    const firstAlternativeTitle = '#alternative-title-0';
    const heparinDown = '#move-down-alternative-0';
    const heparinUp = '#move-up-alternative-1';

    browser
      .getLocationInView(heparinDown)
      .waitForElementVisible(heparinDown)
      .click(heparinDown)
      .assert.containsText(firstAlternativeTitle, 'Enoxaparin')
      .click(heparinUp)
      .assert.containsText(firstAlternativeTitle, 'Heparin');
  },

  'Reordering data sources': function(browser) {
    workspaceService.uploadTestWorkspace(browser, '/createSubproblemTestProblem.json');

    const firstReference = '#data-source-reference-0-0';
    const ref1Down = '#move-down-data-source-0-0';
    const ref1Up = '#move-up-data-source-0-1';

    browser
      .assert.containsText(firstReference, 'ref1')
      .click(ref1Down)
      .assert.containsText(firstReference, 'ref2')
      .click(ref1Up)
      .assert.containsText(firstReference, 'ref1');
  }
};

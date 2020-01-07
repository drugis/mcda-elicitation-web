'use strict';

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const CRITERION_TITLE = '#criterion-title-0';
const EXTRA_CRITERION = manualInputService.createCriterion('c3', 'favorable');

const DATA_SOURCE_TITLE = '//*[@id="criterion-0"]/div[2]/div/div[6]/table/tbody/tr/td[2]/em';
const DATA_SOURCE_REFERENCE = '#linked-data-source-reference-0-0';
const EXTRA_DATA_SOURCE = manualInputService.createDataSource('ref3');

const ALTERNATIVE1_TITLE = '#alternative-title-0';

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser);
  },

  afterEach: function(browser) {
    errorService.isErrorBarHidden(browser).end();
  },

  'Editing a criterion': function(browser) {
    const newTitle = 'newTitle';
    const newDescription = 'newDescription';

    manualInputService.createInputDefault(browser)
      .click('#edit-criterion-0')
      .clearValue('#criterion-title-input')
      .setValue('#criterion-title-input', newTitle)
      .clearValue('#criterion-description-input')
      .setValue('#criterion-description-input', newDescription)
      .click('#favorability-selector-unfavorable')
      .click('#add-criterion-confirm-button')
      .assert.containsText(CRITERION_TITLE, newTitle)
      .assert.containsText('#criterion-description-0', 'Description: ' + newDescription);
  },

  'Editing a data source': function(browser) {
    const newReference = 'newReference';
    const newUrl = 'www.google.com';

    manualInputService.createInputDefault(browser)
      .click('#edit-data-source-0-0')
      .clearValue('#data-source-reference')
      .setValue('#data-source-reference', newReference)
      .clearValue('#data-source-url')
      .setValue('#data-source-url', newUrl)
      .click('#add-data-source-button')
      .assert.containsText(DATA_SOURCE_REFERENCE, newReference);
  },

  'Editing an alternative': function(browser) {
    const newTitle = 'newTitle';

    manualInputService.createInputDefault(browser)
      .click('#edit-alternative-0')
      .clearValue('#alternative-title')
      .setValue('#alternative-title', newTitle)
      .click('#save-alternative-button')
      .assert.containsText(ALTERNATIVE1_TITLE, newTitle);
  },

  'Deleting a criterion': function(browser) {
    manualInputService.createInputDefault(browser);
    manualInputService.addCriterion(browser, EXTRA_CRITERION)
      .click('#delete-criterion-0')
      .assert.containsText(CRITERION_TITLE, EXTRA_CRITERION.title);
  },

  'Deleting a data source': function(browser) {
    manualInputService.createInputDefault(browser)
      .click('#delete-data-source-0-0')
      .useXpath()
      .assert.containsText(DATA_SOURCE_TITLE, 'No data sources defined')
      .useCss();
  },

  'Deleting an alternative': function(browser) {
    manualInputService.createInputDefault(browser)
      .click('#delete-alternative-0')
      .assert.containsText(ALTERNATIVE1_TITLE, manualInputService.ALTERNATIVE2.title);
  },

  'Moving criterion up and down': function(browser) {
    manualInputService.createInputDefault(browser);
    manualInputService.addCriterion(browser, EXTRA_CRITERION)
      .click('#move-up-criterion-1')
      .assert.containsText(CRITERION_TITLE, EXTRA_CRITERION.title)
      .click('#move-down-criterion-0')
      .assert.containsText(CRITERION_TITLE, manualInputService.CRITERION1.title);
  },

  'Moving data source up and down': function(browser) {
    browser
      .waitForElementVisible('#create-workspace-button')
      .click('#create-workspace-button')
      .click('#manual-workspace-radio')
      .click('#add-workspace-button')
      .waitForElementVisible('#manual-input-header-step1')
      .setValue('#workspace-title', manualInputService.TITLE)
      .setValue('#therapeutic-context', manualInputService.THERAPEUTIC_CONTEXT)
      .click('#favorability-checkbox');

    manualInputService.addCriterion(browser, manualInputService.CRITERION1);
    manualInputService.addDataSource(browser, manualInputService.CRITERION1_ADD_DATA_SOURCE, manualInputService.DATA_SOURCE1);
    manualInputService.addDataSource(browser, manualInputService.CRITERION1_ADD_DATA_SOURCE, EXTRA_DATA_SOURCE)
      .click('#move-up-data-source-0-1')
      .assert.containsText(DATA_SOURCE_REFERENCE, EXTRA_DATA_SOURCE.reference)
      .click('#move-down-data-source-0-0')
      .assert.containsText(DATA_SOURCE_REFERENCE, manualInputService.DATA_SOURCE1.reference);
  },

  'Moving an alternative up and down': function(browser) {
    manualInputService.createInputDefault(browser)
      .click('#move-up-alternative-1')
      .assert.containsText(ALTERNATIVE1_TITLE, manualInputService.ALTERNATIVE2.title)
      .click('#move-down-alternative-0')
      .assert.containsText(ALTERNATIVE1_TITLE, manualInputService.ALTERNATIVE1.title);
  },

  'Saving during step 1': function(browser) {
    manualInputService.createInputDefault(browser)
      .click('#step1-save-button')
      .refresh()
      .waitForElementVisible('#manual-input-header-step1')
      .assert.containsText(CRITERION_TITLE, manualInputService.CRITERION1.title)
      .click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, 0);
  },

  'Delete a saved workspace': function(browser) {
    manualInputService.createInputDefault(browser)
      .click('#step1-save-button')
      .click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, 0);
  },

  'Continuing working on a saved workspace': function(browser) {
    manualInputService.createInputDefault(browser)
      .click('#step1-save-button')
      .click('#logo')
      .waitForElementVisible('#in-progress-workspace-0')
      .click('#in-progress-workspace-0')
      .waitForElementVisible('#manual-input-header-step1')
      .assert.containsText(CRITERION_TITLE, manualInputService.CRITERION1.title)
      .click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, 0);
  },

  'Checking and unchecking the favorability button should keep the criteria': function(browser) {
    manualInputService.createInputDefault(browser);
    manualInputService.addCriterion(browser, EXTRA_CRITERION)
      .click('#favorability-checkbox')
      .assert.containsText('#criterion-title-0', manualInputService.CRITERION1.title)
      .assert.containsText('#criterion-title-1', EXTRA_CRITERION.title)
      .assert.containsText('#criterion-title-2', manualInputService.CRITERION2.title);
  }
};

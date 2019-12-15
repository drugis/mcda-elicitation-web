'use strict';

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const errorService = require('./util/errorService');

const testUrl = require('./util/constants').testUrl;

const title = 'manual input';
const therapeuticContext = 'end-to-end test';

const criterion1 = manualInputService.createCriterion('c1', 'favorable');
const criterion2 = manualInputService.createCriterion('c2', 'unfavorable');

const dataSource1 = manualInputService.createDataSource('ref1');
const dataSource2 = manualInputService.createDataSource('ref2');

const alternative1 = manualInputService.createAlternative('a1');
const alternative2 = manualInputService.createAlternative('a2');

const criterion1AddDataSourcePath = '//*[@id="add-data-source-0"]';
const criterion2AddDataSourcePath = '//*[@id="add-data-source-1"]';

function createInputDefault(browser) {
  browser
    .useCss()
    .waitForElementVisible('#manual-input-header-step1')
    .setValue('#workspace-title', title)
    .setValue('#therapeutic-context', therapeuticContext)
    .click('#favorability-checkbox');

  manualInputService.addCriterion(browser, criterion1);
  manualInputService.addCriterion(browser, criterion2);
  manualInputService.addDataSource(browser, criterion1AddDataSourcePath, dataSource1);
  manualInputService.addDataSource(browser, criterion2AddDataSourcePath, dataSource2);
  manualInputService.addAlternative(browser, alternative1);
  manualInputService.addAlternative(browser, alternative2);
}

function addCriterion(browser) {
  browser
    .click('//*[@id="add-criterion-button"]')
    .setValue('//*[@id="criterion-title-input"]', 'c1')
    .click('//*[@id="add-criterion-confirm-button"]');
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="manual-workspace-radio"]')
      .click('//*[@id="add-workspace-button"]');
  },

  afterEach: function(browser) {
    errorService.isErrorBarHidden(browser);
    browser.useCss().end();
  },

  'During manual input, cancel adding a criterion': function(browser) {
    addCriterion(browser);
    browser
      .click('//*[@id="add-criterion-button"]')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('//*[@id="error-1"]', 'At least two criteria required');
  },

  'During manual input, cancel adding a data source': function(browser) {
    addCriterion(browser);
    browser
      .click('//*[@id="add-data-source-0"]')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('//*[@id="criterion-0"]/div[2]/div/div[5]/table/tbody/tr/td[2]/em', 'No data sources defined');
  },

  'During manual input, cancel adding an alternative': function(browser) {
    browser
      .click('//*[@id="add-alternative-button"]')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('//*[@id="alternatives-table"]/tbody/tr/td[2]/em', 'No alternatives defined');
  },

  'During manual input, cancel editing a criterion': function(browser) {
    addCriterion(browser);
    browser
      .click('//*[@id="edit-criterion-0"]')
      .clearValue('//*[@id="criterion-title-input"]')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('//*[@id="criterion-title-0"]', 'c1');
  },

  'During manual input, cancel editing a data source': function(browser) {
    addCriterion(browser);
    browser
      .click('//*[@id="add-data-source-0"]')
      .setValue('//*[@id="data-source-reference"]', 'ref')
      .click('//*[@id="add-data-source-button"]')
      .click('//*[@id="edit-data-source-0-0"]')
      .clearValue('//*[@id="data-source-reference"]')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('//*[@id="data-source-reference-0-0"]', 'ref');
  },

  'During manual input, cancel editing an alternative': function(browser) {
    browser
      .click('//*[@id="add-alternative-button"]')
      .setValue('//*[@id="alternative-title"]', 'a1')
      .click('//*[@id="add-alternative-confirm-button"]')
      .click('/html/body/div[1]/div/div/div[12]/table/tbody/tr/td[3]/a/i')
      .click('//*[@id="alternative-title"]')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('/html/body/div[1]/div/div/div[12]/table/tbody/tr/td[2]', 'a1');
  },

  'During manual input step 2, cancel editing unit of measurement': function(browser) {
    createInputDefault(browser);
    browser
      .useXpath()
      .click('//*[@id="enter-data-button"]')
      .click('//*[@id="edit-unit-of-measurement-c1-ref1"]')
      .setValue('//*[@id="uom-label"]', 'kg')
      .click('//*[@id="uom-save-button"]')
      .click('//*[@id="edit-unit-of-measurement-c1-ref1"]')
      .setValue('//*[@id="uom-label"]', 'l')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('//*[@id="unit-of-measurement-label-c1-ref1"]', 'kg');
  },

  'During manual input step 2, cancel editing uncertainty': function(browser) {
    createInputDefault(browser);
    browser
      .useXpath()
      .click('//*[@id="enter-data-button"]')
      .click('//*[@id="edit-soe-unc-c1-ref1"]')
      .setValue('//*[@id="uncertainties-input"]', 'none')
      .click('//*[@id="save-soe-unc-button"]')
      .click('//*[@id="edit-soe-unc-c1-ref1"]')
      .setValue('//*[@id="uncertainties-input"]', 'not none')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('//*[@id="uncertainties-c1-ref1"]', 'Unc: none');
  }
};

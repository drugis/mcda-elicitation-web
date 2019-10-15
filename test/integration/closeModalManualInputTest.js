'use strict';

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');

const testUrl = 'http://localhost:3002';

const title = 'manual input';
const therapeuticContext = 'end-to-end test';

const criterion1 = createCriterion('c1', 'favorable');
const criterion2 = createCriterion('c2', 'unfavorable');

const dataSource1 = createDataSource('ref1');
const dataSource2 = createDataSource('ref2');

const alternative1 = createAlternative('a1');
const alternative2 = createAlternative('a2');

const criterion1AddDataSourcePath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/button';
const criterion2AddDataSourcePath = '//div[9]/criterion-list/div[2]/div[2]/criterion-card/div/div[2]/div/div[5]/button';

function createCriterion(title, favorability) {
  return {
    title: title,
    description: 'description',
    favorability: favorability
  };
}

function createDataSource(reference) {
  return {
    reference: reference,
    url: 'http://url.com'
  };
}

function createAlternative(title) {
  return { title: title };
}

function createInputDefault(browser) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#manual-workspace-radio')
    .click('#add-workspace-button')
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


module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
  },

  afterEach: function(browser) {
    browser.end();
  },

  'During manual input, cancel adding a criterion': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="manual-workspace-radio"]')
      .click('//*[@id="add-workspace-button"]')
      .click('//*[@id="add-criterion-button"]')
      .setValue('//*[@id="criterion-title-input"]', 'c1')
      .click('//*[@id="add-criterion-confirm-button"]')
      .click('//*[@id="add-criterion-button"]')
      .click('/html/body/div[4]/div/div/form/div/div/button')
      .assert.containsText('/html/body/div[2]/div/div/div[15]/em', 'At least two criteria required')
      .useCss();
  },

  'During manual input, cancel adding a data source': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="manual-workspace-radio"]')
      .click('//*[@id="add-workspace-button"]')
      .click('//*[@id="add-criterion-button"]')
      .setValue('//*[@id="criterion-title-input"]', 'c1')
      .click('//*[@id="add-criterion-confirm-button"]')
      .click('/html/body/div[2]/div/div/div[9]/criterion-list/div/div/criterion-card/div/div[2]/div/div[4]/button')
      .click('/html/body/div[4]/div/div/div/form/button')
      .assert.containsText('/html/body/div[2]/div/div/div[9]/criterion-list/div/div/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[2]/em', 'No data sources defined')
      .useCss();
  },

  'During manual input, cancel adding an alternative': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="manual-workspace-radio"]')
      .click('//*[@id="add-workspace-button"]')
      .click('//*[@id="add-alternative-button"]')
      .click('/html/body/div[4]/div/div/div/form/button')
      .assert.containsText('/html/body/div[2]/div/div/div[12]/table/tbody/tr/td[2]/em', 'No alternatives defined')
      .useCss();
  },

  'During manual input, cancel editing a criterion': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="manual-workspace-radio"]')
      .click('//*[@id="add-workspace-button"]')
      .click('//*[@id="add-criterion-button"]')
      .setValue('//*[@id="criterion-title-input"]', 'c1')
      .click('//*[@id="add-criterion-confirm-button"]')
      .click('/html/body/div[2]/div/div/div[9]/criterion-list/div/div/criterion-card/div/div[2]/div/div[2]/div/a[1]/i')
      .clearValue('//*[@id="criterion-title-input"]')
      .click('/html/body/div[4]/div/div/form/div/div/button')
      .assert.containsText('/html/body/div[2]/div/div/div[9]/criterion-list/div/div/criterion-card/div/div[2]/div/div[1]/h5', 'c1')
      .useCss();
  },

  'During manual input, cancel editing a data source': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="manual-workspace-radio"]')
      .click('//*[@id="add-workspace-button"]')
      .click('//*[@id="add-criterion-button"]')
      .setValue('//*[@id="criterion-title-input"]', 'c1')
      .click('//*[@id="add-criterion-confirm-button"]')
      .click('/html/body/div[2]/div/div/div[9]/criterion-list/div/div/criterion-card/div/div[2]/div/div[4]/button')
      .setValue('//*[@id="data-source-reference"]', 'ref')
      .click('//*[@id="add-data-source-button"]')
      .click('/html/body/div[2]/div/div/div[9]/criterion-list/div/div/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[3]/a/i')
      .clearValue('//*[@id="data-source-reference"]')
      .click('/html/body/div[4]/div/div/div/form/button')
      .assert.containsText('/html/body/div[2]/div/div/div[9]/criterion-list/div/div/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[2]/div', 'ref')
      .useCss();
  },

  'During manual input, cancel editing an alternative': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="create-workspace-button"]')
      .click('//*[@id="manual-workspace-radio"]')
      .click('//*[@id="add-workspace-button"]')
      .click('//*[@id="add-alternative-button"]')
      .setValue('//*[@id="alternative-title"]', 'a1')
      .click('//*[@id="add-alternative-confirm-button"]')
      .click('/html/body/div[2]/div/div/div[12]/table/tbody/tr/td[3]/a/i')
      .click('//*[@id="alternative-title"]')
      .click('//*[@id="close-modal-button"]')
      .assert.containsText('/html/body/div[2]/div/div/div[12]/table/tbody/tr/td[2]', 'a1')
      .useCss();
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
      .click('/html/body/div[4]/div/div/form/div/button')
      .assert.containsText('//*[@id="unit-of-measurement-label-c1-ref1"]', 'kg')      
      .useCss();
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
      .click('/html/body/div[4]/div/div/form/div/button')
      .assert.containsText('//*[@id="uncertainties-c1-ref1"]', 'Unc: none')      
      .useCss();
  }
};

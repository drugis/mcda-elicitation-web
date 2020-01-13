'use strict';

const loginService = require('./util/loginService');
const errorService = require('./util/errorService');

function addCriterion(browser) {
  browser
    .click('#add-criterion-button')
    .setValue('#criterion-title-input', 'c1')
    .click('#add-criterion-confirm-button');
  return browser;
}

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser)
    .click('#create-workspace-button')
    .click('#manual-workspace-radio')
    .click('#add-workspace-button');
}

function afterEach(browser) {
  errorService.isErrorBarHidden(browser).end();
}

function cancelAddingCriterion(browser) {
  addCriterion(browser)
    .click('#add-criterion-button')
    .click('#close-modal-button')
    .assert.containsText('#error-1', 'At least two criteria required');
}

function cancelAddingDataSource(browser) {
  addCriterion(browser)
    .click('#add-data-source-0')
    .click('#close-modal-button')
    .useXpath()
    .assert.containsText('//*[@id="criterion-0"]/div[2]/div/div[5]/table/tbody/tr/td[2]/em', 'No data sources defined')
    .useCss();
}

function cancelAddingAlternative(browser) {
  browser
    .click('#add-alternative-button')
    .click('#close-modal-button')
    .useXpath()
    .assert.containsText('//*[@id="alternatives-table"]/tbody/tr/td[2]/em', 'No alternatives defined')
    .useCss();
}

function cancelEditingCriterion(browser) {
  addCriterion(browser)
    .click('#edit-criterion-0')
    .clearValue('#criterion-title-input')
    .click('#close-modal-button')
    .assert.containsText('#criterion-title-0', 'c1');
}

function cancelEditingDataSource(browser) {
  addCriterion(browser)
    .click('#add-data-source-0')
    .setValue('#data-source-reference', 'ref')
    .click('#add-data-source-button')
    .click('#edit-data-source-0-0')
    .clearValue('#data-source-reference')
    .click('#close-modal-button')
    .assert.containsText('#data-source-reference-0-0', 'ref');
}

function cancelEditingAlternative(browser) {
  browser
    .click('#add-alternative-button')
    .setValue('#alternative-title', 'a1')
    .click('#add-alternative-confirm-button')
    .click('#edit-alternative-0')
    .clearValue('#alternative-title')
    .click('#close-modal-button')
    .assert.containsText('#alternative-title-0', 'a1');
}

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Cancel adding a criterion': cancelAddingCriterion,
  'Cancel adding a data source': cancelAddingDataSource,
  'Cancel adding an alternative': cancelAddingAlternative,
  'Cancel editing a criterion': cancelEditingCriterion,
  'Cancel editing a data source': cancelEditingDataSource,
  'Cancel editing an alternative': cancelEditingAlternative
};

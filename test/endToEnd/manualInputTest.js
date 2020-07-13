'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Editing a title': editTitle,
  'Editing context': editContext,
  'Toggling favourability': toggleFavourability,
  'Remember criterion settings when toggling favourability': rememberCriterionFavourability
};

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const workspaceService = require('./util/workspaceService');

const NEW_CRITERION_TITLE = 'new criterion';

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  manualInputService.createInputDefault(browser);
}

function afterEach(browser) {
  workspaceService.deleteUnfinishedFromList(browser, 0);
}

function editTitle(browser) {
  browser
    .clearValue('#workspace-title')
    .setValue('#workspace-title', 'another title')
    .pause(500)
    .click('#logo')
    .assert.containsText('#in-progress-workspace-0', 'another title');
}

function editContext(browser) {
  browser
    .setValue('#therapeutic-context', 'therapeutic context')
    .pause(500)
    .click('#logo')
    .click('#in-progress-workspace-0')
    .assert.containsText('#therapeutic-context', 'therapeutic context')
    .click('#logo');
}

function toggleFavourability(browser) {
  browser
    .waitForElementVisible('#favourable-criteria-label')
    .waitForElementVisible('#unfavourable-criteria-label')
    .waitForElementVisible('#add-favourable-criterion-cell')
    .waitForElementVisible('#add-unfavourable-criterion-cell')
    .click('#favourability-checkbox')
    .assert.not.elementPresent('#favourable-criteria-label')
    .assert.not.elementPresent('#unfavourable-criteria-label')
    .assert.not.elementPresent('#add-favourable-criterion-cell')
    .waitForElementVisible('#add-unfavourable-criterion-cell')
    .click('#logo');
}

function rememberCriterionFavourability(browser) {
  browser
    .useXpath()
    .click('//*[@id="add-unfavourable-criterion-cell"]/button')
    .click('//*[@id="favourability-checkbox"]')
    .assert.containsText(
      '//*[@id="manual-input-table"]/tbody/tr[5]/td[3]/span/span',
      NEW_CRITERION_TITLE
    )
    .click('//*[@id="favourability-checkbox"]')
    .assert.containsText(
      '//*[@id="manual-input-table"]/tbody/tr[8]/td[3]/span/span',
      NEW_CRITERION_TITLE
    )
    .useCss()
    .click('#logo');
}

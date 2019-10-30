'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');
const chai = require('chai');
const _ = require('lodash');

const testUrl = require('./util/constants').testUrl;

const title = 'GetReal course LU 4, activity 4.4';

function checkValue(expectedValue, result) {
  chai.expect(result.value).to.equal(expectedValue);
}

function showDecimals(browser) {
  browser
    .click('//*[@id="settings-button"]')
    .click('//*[@id="show-decimals-radio"]')
    .click('//*[@id="save-settings-button"]')
    ;
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Verifying all components are visible': function(browser) {
    browser
      .click('#settings-button')
      .waitForElementVisible('#show-percentages-radio')
      .waitForElementVisible('#show-decimals-radio')
      .waitForElementVisible('#deterministic-entered-radio')
      .waitForElementVisible('#deterministic-analysis-radio')
      .waitForElementVisible('#smaa-distribution-radio')
      .waitForElementVisible('#smaa-analysis-radio')
      .waitForElementVisible('#show-median-radio')
      .waitForElementVisible('#show-mode-radio')
      .waitForElementVisible('#toggle-selection-button')
      .waitForElementVisible('#criterion-column-checkbox')
      .waitForElementVisible('#description-column-checkbox')
      .waitForElementVisible('#units-column-checkbox')
      .waitForElementVisible('#reference-column-checkbox')
      .waitForElementVisible('#uncertainties-column-checkbox')
      .waitForElementVisible('#reset-default-button')
      .waitForElementVisible('#save-settings-button')
      .click('#save-settings-button');
  },

  'Default button resetting options': function(browser) {
    browser
      .click('#settings-button')
      .click('#show-decimals-radio')
      .click('#deterministic-analysis-radio')
      .click('#show-mode-radio')
      .click('#criterion-column-checkbox')
      .click('#reset-default-button')
      .waitForElementVisible('#show-percentages-radio:checked')
      .waitForElementVisible('#deterministic-entered-radio:checked')
      .waitForElementVisible('#show-median-radio:checked')
      .waitForElementVisible('#criterion-column-checkbox:checked')
      .waitForElementVisible('#description-column-checkbox:checked')
      .waitForElementVisible('#units-column-checkbox:checked')
      .waitForElementVisible('#reference-column-checkbox:checked')
      .waitForElementVisible('#uncertainties-column-checkbox:checked')
      .click('#save-settings-button');
  },

  '(De)select all button deselects and selects all column options': function(browser) {
    browser
      .click('#settings-button')
      .click('#toggle-selection-button');

    browser.expect.element('#criterion-column-checkbox').to.not.be.selected;
    browser.expect.element('#description-column-checkbox').to.not.be.selected;
    browser.expect.element('#units-column-checkbox').to.not.be.selected;
    browser.expect.element('#reference-column-checkbox').to.not.be.selected;
    browser.expect.element('#uncertainties-column-checkbox').to.not.be.selected;

    browser
      .click('#toggle-selection-button')
      .waitForElementVisible('#criterion-column-checkbox:checked')
      .waitForElementVisible('#description-column-checkbox:checked')
      .waitForElementVisible('#units-column-checkbox:checked')
      .waitForElementVisible('#reference-column-checkbox:checked')
      .waitForElementVisible('#uncertainties-column-checkbox:checked')
      .click('#save-settings-button');
  },

  'Switching settings in problem definition tab': function(browser) {
    var effectTableCellPath = '//effects-table/div/div[3]/table/tbody/tr[2]/td[4]/div/effects-table-cell/div';
    var unitsCellPath = '//effects-table/div/div[3]/table/tbody/tr[2]/td[3]';
    var scaleRangeCellPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[3]/div[3]/table/tbody/tr[1]/td[3]/span[1]';

    browser
      .useXpath()
      .click('//*[@id="problem-definition-tab"]')
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectTableCellPath, '60%')
      .assert.containsText(scaleRangeCellPath, '50');
    showDecimals(browser);
    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectTableCellPath, '60%')
      .assert.containsText(scaleRangeCellPath, '0.5')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="deterministic-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectTableCellPath, '60')
      .assert.containsText(scaleRangeCellPath, '50');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectTableCellPath, '0.6')
      .assert.containsText(scaleRangeCellPath, '0.5')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-distribution-radio"]')
      .click('//*[@id="save-settings-button"]')
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectTableCellPath, _.partial(checkValue, null))
      .assert.containsText(scaleRangeCellPath, '50');
    showDecimals(browser);
    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectTableCellPath, _.partial(checkValue, null))
      .assert.containsText(scaleRangeCellPath, '0.5')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectTableCellPath, '60')
      .assert.containsText(scaleRangeCellPath, '50');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectTableCellPath, '0.6')
      .assert.containsText(scaleRangeCellPath, '0.5')
      .useCss();
  },

  'Unselecting criterion column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[1]/div';
    browser
      .useXpath()
      .click('//*[@id="problem-definition-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="criterion-column-checkbox"]')
      .click('//*[@id="save-settings-button"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting description column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[2]/div';
    browser
      .useXpath()
      .click('//*[@id="problem-definition-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="description-column-checkbox"]')
      .click('//*[@id="save-settings-button"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting units column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[3]/div';
    browser
      .useXpath()
      .click('//*[@id="problem-definition-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="units-column-checkbox"]')
      .click('//*[@id="save-settings-button"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting uncertainties column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[6]/div';
    browser
      .useXpath()
      .click('//*[@id="problem-definition-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="uncertainties-column-checkbox"]')
      .click('//*[@id="save-settings-button"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting reference column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[7]/div';
    browser
      .useXpath()
      .click('//*[@id="problem-definition-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="reference-column-checkbox"]')
      .click('//*[@id="save-settings-button"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting criterion column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[1]';
    browser
      .useXpath()
      .click('//*[@id="deterministic-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="criterion-column-checkbox"]')
      .click('//*[@id="save-settings-button"]')
      .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting description column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[2]';
    browser
      .useXpath()
      .click('//*[@id="deterministic-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="description-column-checkbox"]')
      .click('//*[@id="save-settings-button"]')
      .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting units column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[3]';
    browser
      .useXpath()
      .click('//*[@id="deterministic-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="units-column-checkbox"]')
      .click('//*[@id="save-settings-button"]')
      .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting uncertainties column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[6]';
    browser
      .useXpath()
      .click('//*[@id="deterministic-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="uncertainties-column-checkbox"]')
      .click('//*[@id="save-settings-button"]')
      .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Unselecting reference column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[7]';
    browser
      .useXpath()
      .click('//*[@id="deterministic-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="reference-column-checkbox"]')
      .click('//*[@id="save-settings-button"]')
      .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

    util.isElementHidden(browser, columnPath);
    browser.useCss();
  },

  'Switching between median and mode in deterministic tab': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="deterministic-tab"]')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-mode-radio"]')
      .click('//*[@id="save-settings-button"]')
      .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

    browser.useCss();
  },

  'Switching settings in the overview tab': function(browser) {
    var effectCellPath = '//criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[3]/div/effects-table-cell/div';
    var unitsCellPath = '//criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[2]';

    browser
      .useXpath()
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectCellPath, '60%');
    showDecimals(browser);
    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectCellPath, '60%')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="deterministic-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '60');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.6')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-distribution-radio"]')
      .click('//*[@id="save-settings-button"]')
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectCellPath, _.partial(checkValue, null));
    showDecimals(browser);
    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectCellPath, _.partial(checkValue, null))
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '60');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.6')
      .useCss();
  },

  'Switching settings in the preferences tab': function(browser) {
    var effectCellPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[3]/div/div/div[3]/div[2]/table/tbody/tr[1]/td[4]';
    var unitsCellPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[3]/div/div/div[3]/div[2]/table/tbody/tr[1]/td[3]';

    browser
      .useXpath()
      .click('//*[@id="preferences-tab"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="deterministic-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-distribution-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');
    showDecimals(browser);
    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45')
      .useCss();
  },

  'Switching settings while setting the partial value function': function(browser) {
    var effectCellPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[3]/div/div/div/div/div[2]/div/div[3]/label';

    browser
      .useXpath()
      .click('//*[@id="preferences-tab"]')
      .click('//*[@id="OS-pvf-button"]')
      .assert.containsText(effectCellPath, '45 % is best');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '0.45 is best')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="deterministic-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(effectCellPath, '45 % is best');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '0.45 is best')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-distribution-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(effectCellPath, '45 % is best');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '0.45 is best')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(effectCellPath, '45 % is best');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '0.45 is best')
      .useCss();
  },

  'Switching settings while setting the weights': function(browser) {
    var effectCellPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[3]/div/div/div[1]/div/div[3]/ul/li[1]';

    browser
      .useXpath()
      .click('//*[@id="preferences-tab"]')
      .click('//*[@id="ranking-button"]')
      .assert.containsText(effectCellPath, '2-year survival: 45 %');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '2-year survival: 0.45')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="deterministic-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(effectCellPath, '2-year survival: 45 %');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '2-year survival: 0.45')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-distribution-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(effectCellPath, '2-year survival: 45 %');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '2-year survival: 0.45')
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-percentages-radio"]')
      .click('//*[@id="smaa-analysis-radio"]')
      .click('//*[@id="save-settings-button"]')
      .assert.containsText(effectCellPath, '2-year survival: 45 %');
    showDecimals(browser);
    browser
      .assert.containsText(effectCellPath, '2-year survival: 0.45')
      .useCss();
  }
};

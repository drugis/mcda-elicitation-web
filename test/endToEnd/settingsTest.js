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

function changeDeterministicTabSetting(browser, settingsPath, columnPath) {
  browser
    .useXpath()
    .click('//*[@id="deterministic-tab"]')
    .pause(50)
    .click('//*[@id="settings-button"]')
    .click(settingsPath)
    .click('//*[@id="save-settings-button"]')
    .pause(300)
    .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

  util.isElementHidden(browser, columnPath);
  browser.useCss();
}

function changeProblemDefinitionTabSetting(browser, settingsPath, columnPath) {
  browser
    .useXpath()
    .pause(50)
    .click('//*[@id="problem-definition-tab"]')
    .pause(50)
    .click('//*[@id="settings-button"]')
    .click(settingsPath)
    .click('//*[@id="save-settings-button"]');

  util.isElementHidden(browser, columnPath);
  browser.useCss();
}

function showPercentagesAndValues(browser) {
  browser
    .click('//*[@id="settings-button"]')
    .click('//*[@id="show-percentages-radio"]')
    .click('//*[@id="values-radio"]')
    .click('//*[@id="save-settings-button"]');
}

function showPercentagesAndSmaaEntered(browser) {
  browser
    .click('//*[@id="settings-button"]')
    .click('//*[@id="show-percentages-radio"]')
    .click('//*[@id="entered-radio"]')
    .click('//*[@id="smaa-radio"]')
    .click('//*[@id="save-settings-button"]');
}

function showPercentagesAndSmaaValues(browser) {
  browser
    .click('//*[@id="settings-button"]')
    .click('//*[@id="show-percentages-radio"]')
    .click('//*[@id="values-radio"]')
    .click('//*[@id="smaa-radio"]')
    .click('//*[@id="save-settings-button"]');
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('#workspace-0')
      .waitForElementVisible('#workspace-title');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Verifying all components are visible': function(browser) {
    browser
      .click('#settings-button')
      .waitForElementVisible('#show-percentages-radio')
      .waitForElementVisible('#show-decimals-radio')
      .waitForElementVisible('#deterministic-radio')
      .waitForElementVisible('#smaa-radio')
      .waitForElementVisible('#values-radio')
      .waitForElementVisible('#entered-radio')
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
      .click('#smaa-radio')
      .click('#values-radio')
      .click('#show-mode-radio')
      .click('#criterion-column-checkbox')
      .click('#reset-default-button')
      .waitForElementVisible('#show-percentages-radio:checked')
      .waitForElementVisible('#deterministic-radio:checked')
      .waitForElementVisible('#entered-radio:checked')
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
    var effectTableCellPath = '//*[@id="effectstable"]/tbody/tr[2]/td[4]/div/effects-table-cell/div/div';
    var unitsCellPath = '//*[@id="effectstable"]/tbody/tr[2]/td[3]';
    var scaleRangeCellPath = '//*[@id="scalestable"]/tbody/tr[1]/td[3]/span[1]';

    browser
      .useXpath()
      .pause(50)
      .click('//*[@id="problem-definition-tab"]')
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectTableCellPath, '60%')
      .assert.containsText(scaleRangeCellPath, '50');

    showDecimals(browser);

    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectTableCellPath, '60%')
      .assert.containsText(scaleRangeCellPath, '0.5');

    showPercentagesAndValues(browser);

    browser.assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectTableCellPath, '60')
      .assert.containsText(scaleRangeCellPath, '50');

    showDecimals(browser);

    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectTableCellPath, '0.6')
      .assert.containsText(scaleRangeCellPath, '0.5');

    showPercentagesAndSmaaEntered(browser);

    browser.getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectTableCellPath, _.partial(checkValue, null))
      .assert.containsText(scaleRangeCellPath, '50');

    showDecimals(browser);

    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectTableCellPath, _.partial(checkValue, null))
      .assert.containsText(scaleRangeCellPath, '0.5');

    showPercentagesAndSmaaValues(browser);

    browser.assert.containsText(unitsCellPath, '%')
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
    var settingPath = '//*[@id="criterion-column-checkbox"]';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting description column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[2]/div';
    var settingPath = '//*[@id="description-column-checkbox"]';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting units column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[3]/div';
    var settingPath = '//*[@id="units-column-checkbox"]';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting uncertainties column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[6]/div';
    var settingPath = '//*[@id="uncertainties-column-checkbox"]';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting reference column in problem definition tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div[2]/div/effects-table/div/div[3]/table/thead/tr/th[7]/div';
    var settingPath = '//*[@id="reference-column-checkbox"]';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting criterion column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[1]';
    var settingPath = '//*[@id="criterion-column-checkbox"]';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting description column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[2]';
    var settingPath = '//*[@id="description-column-checkbox"]';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting units column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[3]';
    var settingPath = '//*[@id="units-column-checkbox"]';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting uncertainties column in deterministic results tab': function(browser) {
    var columnPath = '//*[@id="sensitivity-table"]/thead/tr/th[6]';
    var settingPath = '//*[@id="uncertainties-column-checkbox"]';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting reference column in deterministic results tab': function(browser) {
    var columnPath = '/html/body/div[1]/div/div[3]/div/div/div/div/div[4]/div/div/div/sensitivity-table/div/div[3]/table/thead/tr/th[7]';
    var settingPath = '//*[@id="reference-column-checkbox"]';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Switching between median and mode in deterministic tab': function(browser) {
    browser
      .useXpath()
      .click('//*[@id="deterministic-tab"]')
      .pause(50)
      .click('//*[@id="settings-button"]')
      .click('//*[@id="show-mode-radio"]')
      .click('//*[@id="save-settings-button"]')
      .waitForElementVisible('//*[@id="sensitivity-measurements-header"]');

    browser.useCss();
  },

  'Switching settings in the overview tab': function(browser) {
    var effectCellPath = '//criterion-list/div/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[3]/div/effects-table-cell/div';
    var unitsCellPath = '//criterion-list/div/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[2]';

    browser
      .useXpath()
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectCellPath, '60%');

    showDecimals(browser);

    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectCellPath, '60%');

    showPercentagesAndValues(browser);

    browser.assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '60');

    showDecimals(browser);

    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.6');

    showPercentagesAndSmaaEntered(browser);

    browser.getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectCellPath, _.partial(checkValue, null));

    showDecimals(browser);

    browser
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectCellPath, _.partial(checkValue, null));

    showPercentagesAndSmaaValues(browser);

    browser.assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '60');

    showDecimals(browser);

    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.6')
      .useCss();
  },

  'Switching settings in the preferences tab': function(browser) {
    var effectCellPath = '//*[@id="trade-off-block"]/div[2]/table/tbody/tr[1]/td[4]';
    var unitsCellPath = '//*[@id="trade-off-block"]/div[2]/table/tbody/tr[1]/td[3]';

    browser
      .useXpath()
      .click('//*[@id="preferences-tab"]')
      .pause(50)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');

    showDecimals(browser);

    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45');

    showPercentagesAndValues(browser);

    browser.assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');

    showDecimals(browser);

    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45');

    showPercentagesAndSmaaEntered(browser);

    browser.assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');

    showDecimals(browser);

    browser
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45');

    showPercentagesAndSmaaValues(browser);

    browser.assert.containsText(unitsCellPath, '%')
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
      .pause(50)
      .click('//*[@id="OS-pvf-button"]')
      .assert.containsText(effectCellPath, '45 % is best');

    showDecimals(browser);
    browser.assert.containsText(effectCellPath, '0.45 is best');
    showPercentagesAndValues(browser);
    browser.assert.containsText(effectCellPath, '45 % is best');
    showDecimals(browser);
    browser.assert.containsText(effectCellPath, '0.45 is best');
    showPercentagesAndSmaaEntered(browser);
    browser.assert.containsText(effectCellPath, '45 % is best');
    showDecimals(browser);
    browser.assert.containsText(effectCellPath, '0.45 is best');
    showPercentagesAndSmaaValues(browser);
    browser.assert.containsText(effectCellPath, '45 % is best');
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
      .pause(50)
      .click('//*[@id="ranking-button"]')
      .assert.containsText(effectCellPath, '2-year survival: 45 %');

    showDecimals(browser);
    browser.assert.containsText(effectCellPath, '2-year survival: 0.45');
    showPercentagesAndValues(browser);
    browser.assert.containsText(effectCellPath, '2-year survival: 45 %');
    showDecimals(browser);
    browser.assert.containsText(effectCellPath, '2-year survival: 0.45');
    showPercentagesAndSmaaEntered(browser);
    browser.assert.containsText(effectCellPath, '2-year survival: 45 %');
    showDecimals(browser);
    browser.assert.containsText(effectCellPath, '2-year survival: 0.45');
    showPercentagesAndSmaaValues(browser);
    browser.assert.containsText(effectCellPath, '2-year survival: 45 %');
    showDecimals(browser);

    browser
      .assert.containsText(effectCellPath, '2-year survival: 0.45')
      .useCss();
  }
};

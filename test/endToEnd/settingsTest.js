'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');
const chai = require('chai');
const _ = require('lodash');

const title = 'GetReal course LU 4, activity 4.4';

function checkValue(expectedValue, result) {
  chai.expect(result.value).to.equal(expectedValue);
}

function showDecimals(browser) {
  browser
    .useCss()
    .click('#settings-button')
    .click('#show-decimals-radio')
    .click('#save-settings-button')
    .useXpath();
  return browser;
}

function changeDeterministicTabSetting(browser, settingsPath, columnPath) {
  util.delayedClick(browser, '#deterministic-tab', '#sensitivity-measurements-header')
    .click('#settings-button')
    .click(settingsPath)
    .click('#save-settings-button')
    .waitForElementVisible('#sensitivity-measurements-header');

  util.isElementHidden(browser, columnPath, 'css selector');
  return browser;
}

function changeProblemDefinitionTabSetting(browser, settingsPath, columnPath) {
  util.delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
    .click('#settings-button')
    .click(settingsPath)
    .click('#save-settings-button');

  util.isElementHidden(browser, columnPath, 'css selector');
  return browser;
}

function showPercentagesAndValues(browser) {
  browser
    .useCss()
    .click('#settings-button')
    .click('#show-percentages-radio')
    .click('#values-radio')
    .click('#save-settings-button')
    .useXpath();
  return browser;
}

function showPercentagesAndSmaaEntered(browser) {
  browser
    .useCss()
    .click('#settings-button')
    .click('#show-percentages-radio')
    .click('#entered-radio')
    .click('#smaa-radio')
    .click('#save-settings-button')
    .useXpath();
  return browser;
}

function showPercentagesAndSmaaValues(browser) {
  browser
    .useCss()
    .click('#settings-button')
    .click('#show-percentages-radio')
    .click('#values-radio')
    .click('#smaa-radio')
    .click('#save-settings-button')
    .useXpath();
  return browser;
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser);
    workspaceService.addExample(browser, title)
      .click('#workspace-0')
      .waitForElementVisible('#workspace-title');
  },

  afterEach: function(browser) {
    browser.useCss();
    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser).end();
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

    util.delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
      .useXpath()
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectTableCellPath, '60%')
      .assert.containsText(scaleRangeCellPath, '50');

    showDecimals(browser)
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectTableCellPath, '60%')
      .assert.containsText(scaleRangeCellPath, '0.5');

    showPercentagesAndValues(browser)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectTableCellPath, '60')
      .assert.containsText(scaleRangeCellPath, '50');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectTableCellPath, '0.6')
      .assert.containsText(scaleRangeCellPath, '0.5');

    showPercentagesAndSmaaEntered(browser)
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectTableCellPath, _.partial(checkValue, null))
      .assert.containsText(scaleRangeCellPath, '50');

    showDecimals(browser)
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectTableCellPath, _.partial(checkValue, null))
      .assert.containsText(scaleRangeCellPath, '0.5');

    showPercentagesAndSmaaValues(browser)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectTableCellPath, '60')
      .assert.containsText(scaleRangeCellPath, '50');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectTableCellPath, '0.6')
      .assert.containsText(scaleRangeCellPath, '0.5')
      .useCss();
  },

  'Unselecting criterion column in problem definition tab': function(browser) {
    var columnPath = '#column-criterion';
    var settingPath = '#criterion-column-checkbox';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting description column in problem definition tab': function(browser) {
    var columnPath = '#column-description';
    var settingPath = '#description-column-checkbox';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting units column in problem definition tab': function(browser) {
    var columnPath = '#column-unit-of-measurement';
    var settingPath = '#units-column-checkbox';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting uncertainties column in problem definition tab': function(browser) {
    var columnPath = '#column-strength-of-evidence';
    var settingPath = '#uncertainties-column-checkbox';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting reference column in problem definition tab': function(browser) {
    var columnPath = '#column-references';
    var settingPath = '#reference-column-checkbox';
    changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting criterion column in deterministic results tab': function(browser) {
    var columnPath = '#column-criterion';
    var settingPath = '#criterion-column-checkbox';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting description column in deterministic results tab': function(browser) {
    var columnPath = '#column-description';
    var settingPath = '#description-column-checkbox';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting units column in deterministic results tab': function(browser) {
    var columnPath = '#column-unit-of-measurement';
    var settingPath = '#units-column-checkbox';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting uncertainties column in deterministic results tab': function(browser) {
    var columnPath = '#column-strength-of-evidence';
    var settingPath = '#uncertainties-column-checkbox';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Unselecting reference column in deterministic results tab': function(browser) {
    var columnPath = '#column-references';
    var settingPath = '#reference-column-checkbox';
    changeDeterministicTabSetting(browser, settingPath, columnPath);
  },

  'Switching between median and mode in deterministic tab': function(browser) {
    util.delayedClick(browser, '#deterministic-tab', '#sensitivity-measurements-header')
      .click('#settings-button')
      .click('#show-mode-radio')
      .click('#save-settings-button')
      .waitForElementVisible('#sensitivity-measurements-header');
  },

  'Switching settings in the overview tab': function(browser) {
    var effectCellPath = '//*[@id="c-0-ds-0-a-0-table-cell"]/effects-table-cell/div/div';
    var unitsCellPath = '//*[@id="criterion-0"]/div[2]/div/div[5]/table/tbody/tr/td[2]';

    browser
      .useXpath()
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectCellPath, '60%');

    showDecimals(browser)
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .assert.containsText(effectCellPath, '60%');

    showPercentagesAndValues(browser)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '60');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.6');

    showPercentagesAndSmaaEntered(browser)
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectCellPath, _.partial(checkValue, null));

    showDecimals(browser)
      .getValue(unitsCellPath, _.partial(checkValue, null))
      .getValue(effectCellPath, _.partial(checkValue, null));

    showPercentagesAndSmaaValues(browser)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '60');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.6');
  },

  'Switching settings in the preferences tab': function(browser) {
    var effectCellPath = '//*[@id="trade-off-block"]/div[2]/table/tbody/tr[1]/td[4]';
    var unitsCellPath = '//*[@id="trade-off-block"]/div[2]/table/tbody/tr[1]/td[3]';

    util.delayedClick(browser, '#preferences-tab', '#partial-value-functions-header')
      .useXpath()
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45');

    showPercentagesAndValues(browser)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45');

    showPercentagesAndSmaaEntered(browser)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45');

    showPercentagesAndSmaaValues(browser)
      .assert.containsText(unitsCellPath, '%')
      .assert.containsText(effectCellPath, '45');

    showDecimals(browser)
      .assert.containsText(unitsCellPath, 'Proportion')
      .assert.containsText(effectCellPath, '0.45');
  },

  'Switching settings while setting the partial value function': function(browser) {
    var lowestOption = '//*[@id="decreasing-pvf-option"]';

    util.delayedClick(browser, '#preferences-tab', '#partial-value-functions-header')
      .click('#criterion-0-pvf-button')
      .useXpath()
      .assert.containsText(lowestOption, '45 % is best');

    showDecimals(browser)
      .assert.containsText(lowestOption, '0.45 is best');
    showPercentagesAndValues(browser)
      .assert.containsText(lowestOption, '45 % is best');
    showDecimals(browser)
      .assert.containsText(lowestOption, '0.45 is best');
    showPercentagesAndSmaaEntered(browser)
      .assert.containsText(lowestOption, '45 % is best');
    showDecimals(browser)
      .assert.containsText(lowestOption, '0.45 is best');
    showPercentagesAndSmaaValues(browser)
      .assert.containsText(lowestOption, '45 % is best');
    showDecimals(browser)
      .assert.containsText(lowestOption, '0.45 is best');
  },

  'Switching settings while setting the weights': function(browser) {
    var firstCriterion = '//*[@id="criterion-0"]';

    util.delayedClick(browser, '#preferences-tab', '#partial-value-functions-header')
      .click('#ranking-button')
      .useXpath()
      .assert.containsText(firstCriterion, '2-year survival: 45 %');

    showDecimals(browser)
      .assert.containsText(firstCriterion, '2-year survival: 0.45');
    showPercentagesAndValues(browser)
      .assert.containsText(firstCriterion, '2-year survival: 45 %');
    showDecimals(browser)
      .assert.containsText(firstCriterion, '2-year survival: 0.45');
    showPercentagesAndSmaaEntered(browser)
      .assert.containsText(firstCriterion, '2-year survival: 45 %');
    showDecimals(browser)
      .assert.containsText(firstCriterion, '2-year survival: 0.45');
    showPercentagesAndSmaaValues(browser)
      .assert.containsText(firstCriterion, '2-year survival: 45 %');
    showDecimals(browser)
      .assert.containsText(firstCriterion, '2-year survival: 0.45');
  }
};

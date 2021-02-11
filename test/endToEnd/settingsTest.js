'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Verifying all components are visible': verifyComponents,
  'Default button resetting options': reset,
  '(De)select all button deselects and selects all column options': deselectAll,
  // 'Verify that save can not be pressed if there are no values for entered smaa': checkEnteredSmaaDisabled,
  'Switching settings in problem definition tab': switchSettingsInProblemDefinition,
  'Unselecting description column in problem definition tab': unselectDescriptionInProblemDefinition,
  'Unselecting units column in problem definition tab': unselectUnitsInProblemDefinition,
  'Unselecting uncertainties column in problem definition tab': unselectUncertaintiesInProblemDefinition,
  'Unselecting reference column in problem definition tab': unselectReferenceInProblemDefinition,
  'Unselecting description column in deterministic results tab': unselectDescriptionInDeterministic,
  'Unselecting units column in deterministic results tab': unselectUnitsInDeterministic,
  'Unselecting uncertainties column in deterministic results tab': unselectUncertaintiesInDeterministic,
  'Unselecting reference column in deterministic results tab': unselectReferenceInDeterministic,
  'Switching between median and mode in deterministic tab': switchMedianInDeterministic,
  'Switching settings in the overview tab': switchSettingsInOverview,
  'Switching settings in the preferences tab': switchSettingsInPreferences,
  // 'Switching settings while setting the partial value function': switchSettingsWhileSettingPVF,
  // 'Switching settings mid-elicitation': switchSettingsMidRanking,
  'Switching settings on the deterministic tab': switchSettingsOnDeterministicTab
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');
const _ = require('lodash');

const title = 'GetReal course LU 4, activity 4.4';

function checkValue(browser, expectedValue, result) {
  browser.assert.equal(result.value, expectedValue);
}

function showDecimals(browser) {
  return browser
    .click('#settings-button')
    .click('#show-decimals-radio')
    .click('#save-settings-button');
}

function changeDeterministicTabSetting(browser, settingsPath, columnPath) {
  return util
    .delayedClick(
      browser,
      '#deterministic-tab',
      '#sensitivity-measurements-header'
    )
    .click('#settings-button')
    .click(settingsPath)
    .click('#save-settings-button')
    .assert.not.elementPresent('#save-settings-button')
    .pause(100)
    .waitForElementVisible('#sensitivity-measurements-header')
    .assert.not.elementPresent(columnPath);
}

function changeProblemDefinitionTabSetting(browser, settingsPath, columnPath) {
  return util
    .delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
    .click('#settings-button')
    .click(settingsPath)
    .click('#save-settings-button')
    .assert.not.elementPresent(columnPath);
}

function showPercentagesAndValues(browser) {
  browser
    .click('#settings-button')
    .click('#show-percentages-radio')
    .click('#display-mode-selector')
    .click('option[value="deterministicValues"]')
    .click('#save-settings-button');
  return browser;
}

function showPercentagesAndSmaaValues(browser) {
  browser
    .click('#settings-button')
    .click('#show-percentages-radio')
    .click('#display-mode-selector')
    .click('option[value="smaaValues"]')
    .click('#save-settings-button');
  return browser;
}

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');
}

function afterEach(browser) {
  browser.useCss();
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function verifyComponents(browser) {
  browser
    .click('#settings-button')
    .waitForElementVisible('#show-percentages-radio')
    .waitForElementVisible('#show-decimals-radio')
    .waitForElementVisible('#display-mode-selector')
    .waitForElementVisible('#show-median-radio')
    .waitForElementVisible('#show-mode-radio')
    .waitForElementVisible('#toggle-selection-button')
    .waitForElementVisible('#description-column-checkbox')
    .waitForElementVisible('#units-column-checkbox')
    .waitForElementVisible('#reference-column-checkbox')
    .waitForElementVisible('#uncertainties-column-checkbox')
    .waitForElementVisible('#random-seed')
    .waitForElementVisible('#reset-default-button')
    .waitForElementVisible('#save-settings-button')
    .click('#save-settings-button');
}

function reset(browser) {
  browser
    .click('#settings-button')
    .click('#show-decimals-radio')
    .click('#display-mode-selector')
    .click('option[value="smaaValues"]')
    .click('#show-mode-radio')
    .click('#reset-default-button')
    .useXpath()
    .waitForElementVisible(
      '//*[@id="show-percentages-radio"]/*[contains(@class, "Mui-checked")]'
    );
  browser.expect
    .element('//*[@id="display-mode-selector"]')
    .value.to.equal('enteredEffects');
  browser
    .waitForElementVisible(
      '//*[@id="show-median-radio"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementVisible(
      '//*[@id="description-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementVisible(
      '//*[@id="units-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementVisible(
      '//*[@id="reference-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementVisible(
      '//*[@id="uncertainties-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    );

  browser.useCss();
  browser.expect.element('#random-seed').value.to.equal('1234');
  browser.click('#save-settings-button');
}

function deselectAll(browser) {
  browser
    .click('#settings-button')
    .click('#toggle-selection-button')
    .useXpath();

  browser
    .waitForElementNotPresent(
      '//*[@id="description-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementNotPresent(
      '//*[@id="units-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementNotPresent(
      '//*[@id="reference-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementNotPresent(
      '//*[@id="uncertainties-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .click('//*[@id="toggle-selection-button"]')
    .waitForElementVisible(
      '//*[@id="description-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementVisible(
      '//*[@id="units-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementVisible(
      '//*[@id="reference-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .waitForElementVisible(
      '//*[@id="uncertainties-column-checkbox"]/*[contains(@class, "Mui-checked")]'
    )
    .useCss()
    .click('#save-settings-button');
}

function switchSettingsInProblemDefinition(browser) {
  var effectTableCellPath = '#value-cell-dsOS-alt1';
  var unitsCellPath = '#unit-cell-dsOS';
  var scaleRangeCellPath = '#observed-range-OS';
  util
    .delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectTableCellPath, '60')
    .assert.containsText(scaleRangeCellPath, '50');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectTableCellPath, '0.6')
    .assert.containsText(scaleRangeCellPath, '0.5');

  showPercentagesAndValues(browser)
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectTableCellPath, '60')
    .assert.containsText(scaleRangeCellPath, '50');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectTableCellPath, '0.6')
    .assert.containsText(scaleRangeCellPath, '0.5');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectTableCellPath, '')
    .assert.containsText(scaleRangeCellPath, '0.5');

  showPercentagesAndSmaaValues(browser)
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectTableCellPath, '60')
    .assert.containsText(scaleRangeCellPath, '50');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectTableCellPath, '0.6')
    .assert.containsText(scaleRangeCellPath, '0.5')
    .useCss();
}

function unselectDescriptionInProblemDefinition(browser) {
  var columnPath = '#column-description';
  var settingPath = '#description-column-checkbox';
  changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
}

function unselectUnitsInProblemDefinition(browser) {
  var columnPath = '#column-unit-of-measurement';
  var settingPath = '#units-column-checkbox';
  changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
}

function unselectUncertaintiesInProblemDefinition(browser) {
  var columnPath = '#column-strength-of-evidence';
  var settingPath = '#uncertainties-column-checkbox';
  changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
}

function unselectReferenceInProblemDefinition(browser) {
  var columnPath = '#column-references';
  var settingPath = '#reference-column-checkbox';
  changeProblemDefinitionTabSetting(browser, settingPath, columnPath);
}

function unselectDescriptionInDeterministic(browser) {
  var columnPath = '#column-description';
  var settingPath = '#description-column-checkbox';
  changeDeterministicTabSetting(browser, settingPath, columnPath);
}

function unselectUnitsInDeterministic(browser) {
  var columnPath = '#column-unit-of-measurement';
  var settingPath = '#units-column-checkbox';
  changeDeterministicTabSetting(browser, settingPath, columnPath);
}

function unselectUncertaintiesInDeterministic(browser) {
  var columnPath = '#column-strength-of-evidence';
  var settingPath = '#uncertainties-column-checkbox';
  changeDeterministicTabSetting(browser, settingPath, columnPath);
}

function unselectReferenceInDeterministic(browser) {
  var columnPath = '#column-references';
  var settingPath = '#reference-column-checkbox';
  changeDeterministicTabSetting(browser, settingPath, columnPath);
}

function switchMedianInDeterministic(browser) {
  util
    .delayedClick(browser, '#deterministic-tab', '#settings-button')
    .click('#settings-button')
    .click('#show-mode-radio')
    .click('#save-settings-button')
    .pause(2000)
    .waitForElementVisible('#sensitivity-measurements-header');
}

function switchSettingsInOverview(browser) {
  var effectCellPath = '#value-cell-dsOS-alt1';
  var unitsCellPath = '#unit-cell-dsOS';

  browser
    .getValue(unitsCellPath, _.partial(checkValue, browser, null))
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectCellPath, '60');

  showDecimals(browser)
    .getValue(unitsCellPath, _.partial(checkValue, browser, null))
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectCellPath, '0.6');

  showPercentagesAndValues(browser)
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectCellPath, '60');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectCellPath, '0.6');

  showDecimals(browser)
    .getValue(unitsCellPath, _.partial(checkValue, browser, null))
    .getValue(effectCellPath, _.partial(checkValue, browser, null));

  showPercentagesAndSmaaValues(browser)
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectCellPath, '60');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectCellPath, '0.6');
}

function switchSettingsInPreferences(browser) {
  var effectCellPath = '#worst-OS';
  var unitsCellPath = '#unit-OS';

  util
    .delayedClick(
      browser,
      '#preferences-tab',
      '#partial-value-functions-header'
    )
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectCellPath, '45');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectCellPath, '0.45');

  showPercentagesAndValues(browser)
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectCellPath, '45');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectCellPath, '0.45');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectCellPath, '0.45');

  showPercentagesAndSmaaValues(browser)
    .assert.containsText(unitsCellPath, '%')
    .assert.containsText(effectCellPath, '45');

  showDecimals(browser)
    .assert.containsText(unitsCellPath, '')
    .assert.containsText(effectCellPath, '0.45');
}

function switchSettingsWhileSettingPVF(browser) {
  var lowestOption = '#decreasing-pvf-option';

  util
    .delayedClick(
      browser,
      '#preferences-tab',
      '#partial-value-functions-header'
    )
    .click('#advanced-pvf-button-OS')
    .assert.containsText(lowestOption, '45 % is best');

  showDecimals(browser).assert.containsText(lowestOption, '0.45 is best');
  showPercentagesAndValues(browser).assert.containsText(
    lowestOption,
    '45 % is best'
  );
  showDecimals(browser).assert.containsText(lowestOption, '0.45 is best');
  showDecimals(browser).assert.containsText(lowestOption, '0.45 is best');
  showPercentagesAndSmaaValues(browser).assert.containsText(
    lowestOption,
    '45 % is best'
  );
  showDecimals(browser).assert.containsText(lowestOption, '0.45 is best');
}

function switchSettingsMidRanking(browser) {
  var firstRankingSituation = '#situation-OS';
  var firstRankingChoice = '#ranking-choice-OS';

  util
    .delayedClick(
      browser,
      '#preferences-tab',
      '#partial-value-functions-header'
    )
    .click('#ranking-button')
    .assert.containsText(firstRankingSituation, '2-year survival: 45 %')
    .assert.containsText(
      firstRankingChoice,
      'increasing 2-year survival from 45 to 65'
    );

  showDecimals(browser)
    .assert.containsText(firstRankingSituation, '2-year survival: 0.45')
    .assert.containsText(
      firstRankingChoice,
      'increasing 2-year survival from 0.45 to 0.65'
    );
  showPercentagesAndSmaaValues(browser).assert.containsText(
    firstRankingSituation,
    '2-year survival: 45 %'
  );
  showDecimals(browser).assert.containsText(
    firstRankingSituation,
    '2-year survival: 0.45'
  );
}

function switchSettingsOnDeterministicTab(browser) {
  var OSUnitCell = '#unit-cell-dsOS';
  var firstOSSensitivityCell = '#sensitivity-cell-OS-alt1';

  util.delayedClick(
    browser,
    '#deterministic-tab',
    '#sensitivity-measurements-header'
  );
  browser.expect.element(OSUnitCell).text.to.equal('%');
  browser.expect.element(firstOSSensitivityCell).text.to.equal('60');
  showDecimals(browser);
  browser.expect.element(OSUnitCell).text.to.equal('');
  browser.expect.element(firstOSSensitivityCell).text.to.equal('0.6');
}

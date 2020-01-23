'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Deterministic results': results,
  'Deterministic results with recalculated values': recalculatedResults,
  'Switch alternative and criterion for one-way sensitivity analysis measurements plot': modifyMeasurementsPlot,
  'Switch criterion for one-way sensitivity analysis preferences plot': modifyPreferencesPlot
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');

const chai = require('chai');

function checkElementValueGreaterThan(browser, path, value) {
  browser
    .useXpath()
    .getLocationInView(path)
    .getText(path, function (result) {
      chai.expect(parseFloat(result.value)).to.be.above(value);
    })
    .useCss();
}

function checkResetMeasurementValue(browser, path) {
  browser
    .useXpath()
    .getText(path, function (result) {
      chai.expect(parseFloat(result.value)).to.be.below(60);
      chai.expect(parseFloat(result.value)).to.be.above(36);
    })
    .useCss();
}

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .click('#deterministic-tab')
    .waitForElementVisible('#sensitivity-measurements-header')
    .waitForElementVisible('#sensitivity-table');
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService
    .deleteFromList(browser, 0)
    .end();
}

function results(browser) {
  browser
    .waitForElementVisible('#representative-weights-table')
    .waitForElementVisible('#base-case-table')
    .waitForElementVisible('#base-case-plot')
    .waitForElementVisible('#measurements-sensitivity-plot')
    .waitForElementVisible('#preferences-sensitivity-plot')
    .waitForElementVisible('#base-value-profile-table');

  const measurementValuePath = '//sensitivity-table//tr[2]/td[4]//span[1]';
  const weightValuePath = '//*[@id="criterion-0-weight"]';
  const baseCaseValuePath = '//*[@id="alternative-0-base-case"]';
  const baseCaseValueTablePath = '//value-profile-table/table/tbody/tr[1]/td[2]';

  checkElementValueGreaterThan(browser, measurementValuePath, 30);
  checkElementValueGreaterThan(browser, weightValuePath, 0.2);
  checkElementValueGreaterThan(browser, baseCaseValuePath, 0.7);
  checkElementValueGreaterThan(browser, baseCaseValueTablePath, 0.01);
}

function recalculatedResults(browser) {
  const measurementValuePath = '//sensitivity-table//tr[2]/td[4]//span[1]';
  const measurementValueInputPath = '//sensitivity-table//tr[2]/td[4]/sensitivity-input//div[2]/label/input';

  browser
    .useXpath()
    .click(measurementValuePath)
    .clearValue(measurementValueInputPath)
    .setValue(measurementValueInputPath, 63)
    .pause(1000)
    .click('//*[@id="sensitivity-measurements-header"]')
    .click('//*[@id="recalculate-button"]')
    .assert.containsText(measurementValuePath, '63 (36.')
    .waitForElementVisible('//*[@id="recalculated-case-table"]')
    .waitForElementVisible('//*[@id="recalculated-case-plot"]')
    .waitForElementVisible('//*[@id="recalculated-value-profile-table"]')
    .useCss();

  const recalculatedCaseValuePath = '//*[@id="alternative-0-recalculated-case"]';
  checkElementValueGreaterThan(browser, recalculatedCaseValuePath, 0.85);

  browser.click('#reset-button');

  checkResetMeasurementValue(browser, measurementValuePath);

  browser
    .assert.not.elementPresent('#recalculated-case-table')
    .assert.not.elementPresent('#recalculated-case-plot')
    .assert.not.elementPresent('#recalculated-value-profile-table');
}

function modifyMeasurementsPlot(browser) {
  browser
    .click('#measurements-alternative-selector')
    .click('option[label="Fluoxetine"]')
    .assert.containsText('#measurements-alternative-selector', 'Fluoxetine')

    .click('#measurements-criterion-selector')
    .click('option[label="Nausea\ ADRs"]')
    .assert.containsText('#measurements-criterion-selector', 'Nausea\ ADRs');
}

function modifyPreferencesPlot(browser) {
  browser
    .click('#preferences-criterion-selector')
    .click('option[label="Nausea\ ADRs"]')
    .assert.containsText('#preferences-criterion-selector', 'Nausea\ ADRs');
}

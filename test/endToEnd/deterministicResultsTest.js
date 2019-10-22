'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');

const chai = require('chai');

const testUrl = require('./util/constants').testUrl;

function checkElementValueGreaterThan(browser, path, value) {
  browser
    .useXpath()
    .getLocationInView(path)
    .getText(path, function(result) {
      chai.expect(parseFloat(result.value)).to.be.above(value);
    })
    .useCss();
}

function checkResetMeasurementValue(browser, path) {
  browser
    .useXpath()
    .getText(path, function(result) {
      chai.expect(parseFloat(result.value)).to.be.below(60);
      chai.expect(parseFloat(result.value)).to.be.above(36);
    })
    .useCss();
}

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title')
      .click('#deterministic-tab')
      .waitForElementVisible('#sensitivity-measurements-header')
      .waitForElementVisible('#sensitivity-table');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Deterministic results': function(browser) {
    browser
      .waitForElementVisible('#representative-weights-table')
      .waitForElementVisible('#base-case-table')
      .waitForElementVisible('#base-case-plot')
      .waitForElementVisible('#measurements-sensitivity-plot')
      .waitForElementVisible('#preferences-sensitivity-plot');

    const measurementValuePath = '//sensitivity-table//tr[2]/td[4]//span[1]';
    const weightValuePath = '//*[@id="de14e778-f723-48d4-8f4e-1e589714f4f2-weight"]';
    const baseCaseValuePath = '//*[@id="38deaf60-9014-4af9-997e-e5f08bc8c8ff-base-case"]';

    checkElementValueGreaterThan(browser, measurementValuePath, 30);
    checkElementValueGreaterThan(browser, weightValuePath, 0.2);
    checkElementValueGreaterThan(browser, baseCaseValuePath, 0.7);
  },

  'Deterministic results with recalculated values': function(browser) {
    const measurementValuePath = '//sensitivity-table//tr[2]/td[4]//span[1]';
    const measurementValueInputPath = '//sensitivity-table//tr[2]/td[4]/sensitivity-input//div[2]/label/input';

    browser
      .useXpath()
      .click(measurementValuePath)
      .clearValue(measurementValueInputPath)
      .setValue(measurementValueInputPath, 63)
      .click('//*[@id="sensitivity-measurements-header"]')
      .click('//*[@id="recalculate-button"]')
      .assert.containsText(measurementValuePath, '63 (36.')
      .waitForElementVisible('//*[@id="recalculated-case-table"]')
      .waitForElementVisible('//*[@id="recalculated-case-plot"]')
      .useCss();

    const recalculatedCaseValuePath = '//*[@id="38deaf60-9014-4af9-997e-e5f08bc8c8ff-recalculated-case"]';
    checkElementValueGreaterThan(browser, recalculatedCaseValuePath, 0.85);

    browser.click('#reset-button');

    checkResetMeasurementValue(browser, measurementValuePath);
    util.isElementNotPresent(browser, '//*[@id="recalculated-case-table"]');
    util.isElementNotPresent(browser, '//*[@id="recalculated-case-plot"]');
  },

  'Switch alternative and criterion for one-way sensitivity analysis measurements plot': function(browser) {
    browser
      .click('#measurements-alternative-selector')
      .click('option[label="Fluoxetine"]')
      .assert.containsText('#measurements-alternative-selector', 'Fluoxetine')

      .click('#measurements-criterion-selector')
      .click('option[label="Nausea\ ADRs"]')
      .assert.containsText('#measurements-criterion-selector', 'Nausea\ ADRs');
  },

  'Switch criterion for one-way sensitivity analysis preferences plot': function(browser) {
    browser
      .click('#preferences-criterion-selector')
      .click('option[label="Nausea\ ADRs"]')
      .assert.containsText('#preferences-criterion-selector', 'Nausea\ ADRs');
  }
};

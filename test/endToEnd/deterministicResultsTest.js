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

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .click('#deterministic-tab')
    .waitForElementVisible('#sensitivity-measurements-header')
    .waitForElementVisible('#sensitivity-measurements-table');
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function results(browser) {
  browser
    .waitForElementVisible('#deterministic-weights-table')
    .waitForElementVisible('#value-profile-plot-base')
    .waitForElementVisible('#base-total-value-table')
    .waitForElementVisible('#base-value-profiles-table')
    .waitForElementVisible('#measurements-sensitivity-plot')
    .waitForElementVisible('#preferences-sensitivity-plot');

  const measurementValuePath =
    '//*[@id="sensitivity-cell-treatmentRespondersId-placeboId"]/button/span[1]';
  const weightValuePath =
    '//*[@id="deterministic-weights-table"]/tbody/tr/td[1]';
  const baseTotalValuePath =
    '//*[@id="base-total-value-table"]/table/tbody/tr/td[1]';
  const baseValueProfilePath =
    '//*[@id="base-value-profiles-table"]/table/tbody/tr[1]/td[2]';

  browser.useXpath();
  browser.expect.element(measurementValuePath).text.to.equal('36.6');
  browser.expect.element(weightValuePath).text.to.equal('0.25');
  browser.expect.element(baseTotalValuePath).text.to.equal('0.714');
  browser.expect.element(baseValueProfilePath).text.to.equal('0.0617');
  browser.useCss();
}

function recalculatedResults(browser) {
  const measurementValuePath =
    '//*[@id="sensitivity-cell-treatmentRespondersId-placeboId"]/button/span[1]';
  const measurementValueInputPath = '//*[@id="sensitivity-value-input"]';

  browser
    .useXpath()
    .click(measurementValuePath)
    .clearValue(measurementValueInputPath)
    .setValue(measurementValueInputPath, 63)
    .sendKeys(measurementValueInputPath, browser.Keys.ESCAPE)
    .pause(1000)
    .click('//*[@id="sensitivity-measurements-header"]')
    .click('//*[@id="recalculate-button"]')
    .assert.containsText(measurementValuePath, '63 (36.6)')
    .waitForElementVisible('//*[@id="value-profile-plot-recalculated"]')
    .waitForElementVisible('//*[@id="recalculated-total-value-table"]')
    .waitForElementVisible('//*[@id="recalculated-value-profiles-table"]');

  const recalculatedTotalValuePath =
    '//*[@id="recalculated-total-value-table"]/table/tbody/tr/td[1]';
  const recalculatedValueProfilePath =
    '//*[@id="recalculated-value-profiles-table"]/table/tbody/tr[1]/td[2]';

  browser.expect.element(recalculatedTotalValuePath).text.to.equal('0.903');
  browser.expect.element(recalculatedValueProfilePath).text.to.equal('0.25');

  browser.click('//*[@id="reset-button"]');

  browser.expect.element(measurementValuePath).text.to.equal('36.6');

  browser.useCss();
  browser.assert.not
    .elementPresent('#recalculated-case-table')
    .assert.not.elementPresent('#recalculated-case-plot')
    .assert.not.elementPresent('#recalculated-value-profile-table');
}

function modifyMeasurementsPlot(browser) {
  browser
    .click('#measurements-alternative-selector')
    .click('option[value="fluoxetineId"]')
    .assert.containsText('#measurements-alternative-selector', 'Fluoxetine')

    .click('#measurements-criterion-selector')
    .click('option[value="nauseaId"]')
    .assert.containsText('#measurements-criterion-selector', 'Nausea ADRs');
}

function modifyPreferencesPlot(browser) {
  browser
    .click('#preferences-criterion-selector')
    .click('option[value="nauseaId"]')
    .assert.containsText('#preferences-criterion-selector', 'Nausea ADRs');
}

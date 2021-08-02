import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Deterministic results': results,
  'Deterministic results with recalculated measurement values':
    recalculatedMeasurementResults,
  'Deterministic results with recalculated weights': recalculatedWeights,
  'Switch alternative and criterion for one-way sensitivity analysis measurements plot':
    modifyMeasurementsPlot,
  'Switch criterion for one-way sensitivity analysis preferences plot':
    modifyPreferencesPlot,
  'Perform relative-based sensitivity analysis': relativeSensitivity
};

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function beforeEach(browser: NightwatchBrowser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .click('#deterministic-results-tab')
    .waitForElementVisible('#sensitivity-measurements-header')
    .waitForElementVisible('#sensitivity-measurements-table');
}

function afterEach(browser: NightwatchBrowser) {
  browser.useCss().click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function results(browser: NightwatchBrowser) {
  browser
    .waitForElementVisible('#deterministic-weights-table')
    .waitForElementVisible('#value-profile-plot-base')
    .waitForElementVisible('#base-total-value-table')
    .waitForElementVisible('#base-value-profiles-table')
    .waitForElementVisible('#measurements-sensitivity-plot')
    .waitForElementVisible('#preferences-sensitivity-plot');

  const measurementValuePath =
    '//*[@id="sensitivity-cell-treatmentRespondersId-placeboId"]/button/span[1]';
  const weightValuePath = '//*[@id="weight-treatmentRespondersId"]';
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

function recalculatedMeasurementResults(browser: NightwatchBrowser) {
  const measurementValuePath =
    '#sensitivity-cell-treatmentRespondersId-placeboId';
  const measurementValueInputPath = '#value-input';

  browser
    .click(measurementValuePath)
    .clearValue(measurementValueInputPath)
    .setValue(measurementValueInputPath, '63')
    .sendKeys(measurementValueInputPath, browser.Keys.ESCAPE)
    .waitForElementVisible(measurementValuePath);
  browser.expect.element(measurementValuePath).text.to.equal('63 (36.6)');
  browser
    .click('#measurements-recalculate-button')
    .waitForElementVisible('#value-profile-plot-recalculated')
    .waitForElementVisible('#recalculated-total-value-table')
    .waitForElementVisible('#recalculated-value-profiles-table');

  const recalculatedTotalValuePath =
    '//*[@id="recalculated-total-value-table"]/table/tbody/tr/td[1]';
  const recalculatedValueProfilePath =
    '//*[@id="recalculated-value-profiles-table"]/table/tbody/tr[1]/td[2]';

  browser
    .useXpath()
    .expect.element(recalculatedTotalValuePath)
    .text.to.equal('0.903');
  browser.expect.element(recalculatedValueProfilePath).text.to.equal('0.25');
  browser.useCss();

  browser
    .click('#measurements-reset-button')
    .expect.element(measurementValuePath)
    .text.to.equal('36.6');

  browser.assert.not
    .elementPresent('#recalculated-case-table')
    .assert.not.elementPresent('#recalculated-case-plot')
    .assert.not.elementPresent('#recalculated-value-profile-table');
}

function recalculatedWeights(browser: NightwatchBrowser) {
  browser
    .click('#importance-treatmentRespondersId > button')
    .waitForElementVisible('#value-input')
    .clearValue('#value-input')
    .setValue('#value-input', '63')
    .sendKeys('#value-input', browser.Keys.ESCAPE)
    .waitForElementVisible('#equivalent-change-treatmentRespondersId');
  browser.expect
    .element('#equivalent-change-treatmentRespondersId')
    .text.to.equal('11.1 (17.5) %');
}

function modifyMeasurementsPlot(browser: NightwatchBrowser) {
  browser
    .waitForElementVisible('#measurements-alternative-selector')
    .click('#measurements-alternative-selector')
    .click('option[value="fluoxetineId"]')
    .expect.element('#measurements-alternative-selector')
    .text.to.equal('Fluoxetine')

    .click('#measurements-criterion-selector')
    .click('option[value="nauseaId"]')
    .expect.element('#measurements-criterion-selector')
    .text.to.equal('Nausea ADRs');
}

function modifyPreferencesPlot(browser: NightwatchBrowser) {
  browser
    .waitForElementPresent('#preferences-criterion-selector')
    .click('#preferences-criterion-selector')
    .click('option[value="nauseaId"]')
    .expect.element('#preferences-criterion-selector')
    .text.to.equal('Nausea ADRs');
}

function relativeSensitivity(browser: NightwatchBrowser) {
  browser
    .waitForElementPresent('#value-profile-type-relative')
    .click('#value-profile-type-relative')
    .waitForElementPresent('#value-profile-reference-select-base')
    .expect.element('#relative-total-difference')
    .text.to.equal('0.112');
  browser
    .click('#value-profile-comparator-select-base')
    .click(
      '#value-profile-comparator-select-base > option[value="venlafaxineId"]'
    )
    .pause(500)
    .expect.element('#relative-total-difference')
    .text.to.equal('0.279');
  browser
    .click('#measurements-recalculate-button')
    .waitForElementVisible('#recalculated-profile-plot')
    .expect.element('#total-value-alternative-header-1-recalculated')
    .text.to.equal('Venlafaxine');
  browser
    .click('#value-profile-comparator-select-base')
    .click(
      '#value-profile-comparator-select-base > option[value="fluoxetineId"]'
    )
    .expect.element('#total-value-alternative-header-1-recalculated')
    .text.to.equal('Venlafaxine');
}

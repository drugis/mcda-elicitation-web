import {NightwatchBrowser} from 'nightwatch';
import {
  customCriterionWithDistributionsAnalysis,
  customCriterionWithDistributionsEntered,
  customCriterionWithEffectsAnalysis,
  customCriterionWithEffectsEntered,
  decimalCriterionWithDistributionsDepercentifiedAnalysis,
  decimalCriterionWithDistributionsDepercentifiedEntered,
  decimalCriterionWithDistributionsPercentifiedAnalysis,
  decimalCriterionWithDistributionsPercentifiedEntered,
  decimalCriterionWithEffectsDepercentifiedAnalysis,
  decimalCriterionWithEffectsDepercentifiedEntered,
  decimalCriterionWithEffectsPercentifiedAnalysis,
  decimalCriterionWithEffectsPercentifiedEntered,
  ICriterionRow,
  ICriterionRowWithUncertainty,
  percentageCriterionWithDistributionsDepercentifiedAnalysis,
  percentageCriterionWithDistributionsDepercentifiedEntered,
  percentageCriterionWithDistributionsPercentifiedAnalysis,
  percentageCriterionWithDistributionsPercentifiedEntered,
  percentageCriterionWithEffectsDepercentifiedAnalysis,
  percentageCriterionWithEffectsDepercentifiedEntered,
  percentageCriterionWithEffectsPercentifiedAnalysis,
  percentageCriterionWithEffectsPercentifiedEntered
} from './util/displayTestUtil';
import loginService from './util/loginService';
import util from './util/util';
import workspaceService from './util/workspaceService';

export = {
  'Check displayed values for effects and distributions': checkDisplayedValues
};

function checkDisplayedValues(browser: NightwatchBrowser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(
    browser,
    '/allEffectAndDistributionTypes.json'
  );
  util.delayedClick(
    browser,
    '#problem-definition-tab',
    '#effects-table-header'
  );

  assertCriterionRow(
    browser,
    percentageCriterionWithEffectsPercentifiedEntered
  );
  assertCriterionRow(browser, decimalCriterionWithEffectsPercentifiedEntered);
  assertCriterionRow(browser, customCriterionWithEffectsEntered);

  switchSettings(
    browser,
    '#show-decimals-radio',
    '#entered-radio',
    '#deterministic-radio'
  );

  assertCriterionRow(
    browser,
    percentageCriterionWithEffectsDepercentifiedEntered
  );
  assertCriterionRow(browser, decimalCriterionWithEffectsDepercentifiedEntered);
  assertCriterionRow(browser, customCriterionWithEffectsEntered);

  switchSettings(
    browser,
    '#show-percentages-radio',
    '#entered-radio',
    '#smaa-radio'
  );

  assertCriterionRow(
    browser,
    percentageCriterionWithDistributionsPercentifiedEntered
  );
  assertCriterionRow(
    browser,
    decimalCriterionWithDistributionsPercentifiedEntered
  );
  assertCriterionRow(browser, customCriterionWithDistributionsEntered);

  switchSettings(
    browser,
    '#show-decimals-radio',
    '#entered-radio',
    '#smaa-radio'
  );

  assertCriterionRow(
    browser,
    percentageCriterionWithDistributionsDepercentifiedEntered
  );
  assertCriterionRow(
    browser,
    decimalCriterionWithDistributionsDepercentifiedEntered
  );
  assertCriterionRow(browser, customCriterionWithDistributionsEntered);

  switchSettings(
    browser,
    '#show-percentages-radio',
    '#values-radio',
    '#deterministic-radio'
  );

  assertCriterionRow(
    browser,
    percentageCriterionWithEffectsPercentifiedAnalysis
  );
  assertCriterionRow(browser, decimalCriterionWithEffectsPercentifiedAnalysis);
  assertCriterionRow(browser, customCriterionWithEffectsAnalysis);

  switchSettings(
    browser,
    '#show-decimals-radio',
    '#values-radio',
    '#deterministic-radio'
  );

  assertCriterionRow(
    browser,
    percentageCriterionWithEffectsDepercentifiedAnalysis
  );
  assertCriterionRow(
    browser,
    decimalCriterionWithEffectsDepercentifiedAnalysis
  );
  assertCriterionRow(browser, customCriterionWithEffectsAnalysis);

  switchSettings(
    browser,
    '#show-percentages-radio',
    '#values-radio',
    '#smaa-radio'
  );

  assertCriterionRowWithUncertainties(
    browser,
    percentageCriterionWithDistributionsPercentifiedAnalysis
  );
  assertCriterionRowWithUncertainties(
    browser,
    decimalCriterionWithDistributionsPercentifiedAnalysis
  );
  assertCriterionRowWithUncertainties(
    browser,
    customCriterionWithDistributionsAnalysis
  );

  switchSettings(
    browser,
    '#show-decimals-radio',
    '#values-radio',
    '#smaa-radio'
  );

  assertCriterionRowWithUncertainties(
    browser,
    percentageCriterionWithDistributionsDepercentifiedAnalysis
  );
  assertCriterionRowWithUncertainties(
    browser,
    decimalCriterionWithDistributionsDepercentifiedAnalysis
  );
  assertCriterionRowWithUncertainties(
    browser,
    customCriterionWithDistributionsAnalysis
  );

  browser.end();
}

function assertCriterionRow(
  browser: NightwatchBrowser,
  {
    criterionId,
    dataSourceId,
    title,
    unit,
    alt1Value,
    alt2Value,
    alt3Value,
    alt4Value,
    alt5Value,
    alt6Value,
    alt7Value
  }: ICriterionRow
): void {
  browser.expect
    .element('#criterion-title-' + criterionId)
    .text.to.equal(title);
  browser.expect
    .element('#criterion-description-' + criterionId)
    .text.to.equal('description');
  browser.expect.element('#unit-cell-' + dataSourceId).text.to.equal(unit);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt1Id')
    .text.to.equal(alt1Value);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt2Id')
    .text.to.equal(alt2Value);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt3Id')
    .text.to.equal(alt3Value);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt4Id')
    .text.to.equal(alt4Value);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt5Id')
    .text.to.equal(alt5Value);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt6Id')
    .text.to.equal(alt6Value);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt7Id')
    .text.to.equal(alt7Value);
}

function assertCriterionRowWithUncertainties(
  browser: NightwatchBrowser,
  {
    criterionId,
    dataSourceId,
    title,
    unit,
    alt1Value,
    alt1Uncertainty,
    alt2Value,
    alt2Uncertainty,
    alt3Value,
    alt3Uncertainty,
    alt4Value,
    alt4Uncertainty,
    alt5Value,
    alt5Uncertainty,
    alt6Value,
    alt7Value
  }: ICriterionRowWithUncertainty
): void {
  browser.expect
    .element('#criterion-title-' + criterionId)
    .text.to.equal(title);
  browser.expect
    .element('#criterion-description-' + criterionId)
    .text.to.equal('description');
  browser.expect.element('#unit-cell-' + dataSourceId).text.to.equal(unit);
  browser.useXpath();
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt1Id"]/div/div[1]')
    .text.to.equal(alt1Value);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt1Id"]/div/div[2]')
    .text.to.equal(alt1Uncertainty);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt2Id"]/div/div[1]')
    .text.to.equal(alt2Value);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt2Id"]/div/div[2]')
    .text.to.equal(alt2Uncertainty);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt3Id"]/div/div[1]')
    .text.to.equal(alt3Value);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt3Id"]/div/div[2]')
    .text.to.equal(alt3Uncertainty);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt4Id"]/div/div[1]')
    .text.to.equal(alt4Value);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt4Id"]/div/div[2]')
    .text.to.equal(alt4Uncertainty);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt5Id"]/div/div[1]')
    .text.to.equal(alt5Value);
  browser.expect
    .element('//*[@id="value-cell-' + dataSourceId + '-alt5Id"]/div/div[2]')
    .text.to.equal(alt5Uncertainty);
  browser.useCss();
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt6Id')
    .text.to.equal(alt6Value);
  browser.expect
    .element('#value-cell-' + dataSourceId + '-alt7Id')
    .text.to.equal(alt7Value);
}

function switchSettings(
  browser: NightwatchBrowser,
  percentageOrDecimal: string,
  enteredOrAnalysis: string,
  deterministicOrSmaa: string
): void {
  browser
    .click('#settings-button')
    .waitForElementVisible(percentageOrDecimal)
    .click(percentageOrDecimal)
    .waitForElementVisible(enteredOrAnalysis)
    .click(enteredOrAnalysis)
    .waitForElementVisible(deterministicOrSmaa)
    .click(deterministicOrSmaa)
    .click('#save-settings-button')
    .waitForElementNotPresent('#save-settings-button');
}

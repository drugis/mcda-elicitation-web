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
  percentageCriterionWithDistributionsDepercentifiedAnalysis,
  percentageCriterionWithDistributionsDepercentifiedEntered,
  percentageCriterionWithDistributionsPercentifiedAnalysis,
  percentageCriterionWithDistributionsPercentifiedEntered,
  percentageCriterionWithEffectsDepercentifiedAnalysis,
  percentageCriterionWithEffectsDepercentifiedEntered,
  percentageCriterionWithEffectsPercentifiedAnalysis,
  percentageCriterionWithEffectsPercentifiedEntered
} from './util/effectsTableDisplayTestUtil';
import ICriterionRow from './util/ICriterionRow';
import ICriterionRowWithUncertainty from './util/ICriterionRowWithUncertainty';
import loginService from './util/loginService';
import util from './util/util';
import workspaceService from './util/workspaceService';

export = {
  beforeEach: beforeEach,
  'Check displayed values for effects and distributions': checkDisplayedValues,
  'Check displayed values after copying': checkCopiedValues
};
// Values used for analysis differ for 1st and 2nd criterion for distributions because they are randomly sampled

function beforeEach(browser: NightwatchBrowser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(
    browser,
    '/allEffectAndDistributionTypes.json'
  );
}

function checkDisplayedValues(browser: NightwatchBrowser) {
  runAssertions(browser);
  browser.end();
}

function runAssertions(browser: NightwatchBrowser) {
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
}

function assertCriterionRow(
  browser: NightwatchBrowser,
  {
    rowNumber,
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
  const pathPrefix: string = `//*[@id="effects-table"]/tbody/tr[${rowNumber}]`;
  browser.useXpath();
  browser.expect.element(`${pathPrefix}/td[1]`).text.to.equal(title);
  browser.expect.element(`${pathPrefix}/td[2]`).text.to.equal('description');
  browser.expect.element(`${pathPrefix}/td[3]`).text.to.equal(unit);
  browser.expect.element(`${pathPrefix}/td[4]`).text.to.equal(alt1Value);
  browser.expect.element(`${pathPrefix}/td[5]`).text.to.equal(alt2Value);
  browser.expect.element(`${pathPrefix}/td[6]`).text.to.equal(alt3Value);
  browser.expect.element(`${pathPrefix}/td[7]`).text.to.equal(alt4Value);
  browser.expect.element(`${pathPrefix}/td[8]`).text.to.equal(alt5Value);
  browser.expect.element(`${pathPrefix}/td[9]`).text.to.equal(alt6Value);
  browser.expect.element(`${pathPrefix}/td[10]`).text.to.equal(alt7Value);
  browser.useCss();
}

function assertCriterionRowWithUncertainties(
  browser: NightwatchBrowser,
  {
    rowNumber,
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
  const pathPrefix: string = `//*[@id="effects-table"]/tbody/tr[${rowNumber}]`;
  browser.useXpath();
  browser.expect.element(`${pathPrefix}/td[1]`).text.to.equal(title);
  browser.expect.element(`${pathPrefix}/td[2]`).text.to.equal('description');
  browser.expect.element(`${pathPrefix}/td[3]`).text.to.equal(unit);
  browser.expect
    .element(`${pathPrefix}/td[4]/div/div[1]`)
    .text.to.equal(alt1Value);
  browser.expect
    .element(`${pathPrefix}/td[4]/div/div[2]`)
    .text.to.equal(alt1Uncertainty);
  browser.expect
    .element(`${pathPrefix}/td[5]/div/div[1]`)
    .text.to.equal(alt2Value);
  browser.expect
    .element(`${pathPrefix}/td[5]/div/div[2]`)
    .text.to.equal(alt2Uncertainty);
  browser.expect
    .element(`${pathPrefix}/td[6]/div/div[1]`)
    .text.to.equal(alt3Value);
  browser.expect
    .element(`${pathPrefix}/td[6]/div/div[2]`)
    .text.to.equal(alt3Uncertainty);
  browser.expect
    .element(`${pathPrefix}/td[7]/div/div[1]`)
    .text.to.equal(alt4Value);
  browser.expect
    .element(`${pathPrefix}/td[7]/div/div[2]`)
    .text.to.equal(alt4Uncertainty);
  browser.expect
    .element(`${pathPrefix}/td[8]/div/div[1]`)
    .text.to.equal(alt5Value);
  browser.expect
    .element(`${pathPrefix}/td[8]/div/div[2]`)
    .text.to.equal(alt5Uncertainty);
  browser.expect.element(`${pathPrefix}/td[9]`).text.to.equal(alt6Value);
  browser.expect.element(`${pathPrefix}/td[10]`).text.to.equal(alt7Value);
  browser.useCss();
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

function checkCopiedValues(browser: NightwatchBrowser) {
  browser
    .click('#logo')
    .click('#copy-workspace-0 > span > button')
    .waitForElementVisible('#finish-creating-workspace')
    .click('#finish-creating-workspace');

  runAssertions(browser);
  browser.end();
}

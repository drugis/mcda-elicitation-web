import {NightwatchBrowser} from 'nightwatch';

export = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Setting the weights through ranking': ranking,
  'Ranking previous button': rankingGoBack,
  'Setting the weights through matching': matching,
  'Setting the weights through matching with a piecewise-linear pvf':
    matchingPiecewiseLinear,
  'Matching previous button': matchingGoBack,
  'Setting the weights through precise swing weighting': preciseSwing,
  'Precise swing previous button': preciseSwingGoBack,
  'Setting the weights through imprecise swing weighting': impreciseSwing,
  'Imprecise swing previous button': impreciseSwingGoBack
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

function loadTestWorkspace(browser: NightwatchBrowser) {
  workspaceService
    .addExample(browser, 'GetReal course LU 4, activity 4.4')
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');

  errorService
    .isErrorBarNotPresent(browser)
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

function resetWeights(browser: NightwatchBrowser) {
  browser
    .click('#reset-button')
    .assert.containsText('#elicitation-method', 'None')
    .assert.containsText('#importance-criterion-OS', '99%')
    .assert.containsText('#importance-criterion-severe', '99%') // weird values until https://trello.com/c/GU9kYoX0/3744-mcda-change-how-weights-are-calculated done
    .assert.containsText('#importance-criterion-moderate', '100%');
}

function checkMethod(browser: NightwatchBrowser, method: string) {
  browser
    .waitForElementVisible('#preferences-weights-table')
    .assert.containsText('#elicitation-method', method);
}

function checkColumnContents(
  browser: NightwatchBrowser,
  column: string,
  value1: string,
  value2: string,
  value3: string
) {
  browser.assert
    .containsText(`#${column}-criterion-OS`, value1)
    .assert.containsText(`#${column}-criterion-severe`, value2)
    .assert.containsText(`#${column}-criterion-moderate`, value3);
}

function beforeEach(browser: NightwatchBrowser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  loadTestWorkspace(browser);
  browser.pause(1000);
}

function afterEach(browser: NightwatchBrowser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function ranking(browser: NightwatchBrowser) {
  browser
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .click('#criterion-option-OS')
    .click('#next-button')
    .click('#criterion-option-severe')
    .click('#save-button');

  checkMethod(browser, 'Ranking');
  checkColumnContents(browser, 'importance', '100%', '46%', '18%');
  checkColumnContents(browser, 'ranking', '1', '2', '3');
  resetWeights(browser);
}

function rankingGoBack(browser: NightwatchBrowser) {
  browser
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

function matching(browser, expectedOsImportance) {
  const sliderValue = '//*[@id="matching-slider"]/span[3]';

  browser
    .click('#matching-button')
    .waitForElementVisible('#matching-title-header')
    .click('#criterion-option-severe')
    .click('#next-button')
    .useXpath()
    .click(sliderValue)
    .sendKeys(sliderValue, [
      browser.Keys.ARROW_RIGHT,
      browser.Keys.ARROW_RIGHT,
      browser.Keys.ARROW_RIGHT
    ])
    .useCss()
    .assert.containsText('#matching-cell', '3')
    .click('#next-button')
    .click('#save-button');

  checkMethod(browser, 'Matching');
  checkColumnContents(
    browser,
    'importance',
    expectedOsImportance ? expectedOsImportance : '96%',
    '100%',
    '100%'
  );
  checkColumnContents(browser, 'ranking', '3', '1', '1');

  resetWeights(browser);
}

function matchingPiecewiseLinear(browser: NightwatchBrowser) {
  browser
    .click('#advanced-pvf-button-severe')
    .click('#decreasing-pvf-option')
    .click('span.MuiSlider-mark:nth-child(14)') // 11 on slider
    .click('span.MuiSlider-mark:nth-child(37)') // 34 on slider
    .click('span.MuiSlider-mark:nth-child(79)') // 76 on slider
    .pause(1000)
    .click('#save-button')
    .waitForElementVisible('#partial-value-functions-block');
  matching(browser, '93%');
}

function matchingGoBack(browser: NightwatchBrowser) {
  browser
    .click('#matching-button')
    .waitForElementVisible('#matching-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 3')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 3')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 3');
}

function preciseSwing(browser: NightwatchBrowser) {
  browser
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#criterion-option-OS')
    .click('#next-button')
    .click('#save-button');

  checkMethod(browser, 'Precise Swing Weighting');
  checkColumnContents(browser, 'importance', '100%', '100%', '100%');
  checkColumnContents(browser, 'ranking', '1', '1', '1');
  resetWeights(browser);
}

function preciseSwingGoBack(browser: NightwatchBrowser) {
  browser
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

function impreciseSwing(browser: NightwatchBrowser) {
  browser
    .click('#imprecise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#criterion-option-OS')
    .click('#next-button')
    .click('#save-button');

  checkMethod(browser, 'Imprecise Swing Weighting');
  checkColumnContents(browser, 'importance', '100%', '33%', '33%');
  checkColumnContents(browser, 'ranking', '1', '2', '3');

  resetWeights(browser);
}

function impreciseSwingGoBack(browser: NightwatchBrowser) {
  browser
    .click('#imprecise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

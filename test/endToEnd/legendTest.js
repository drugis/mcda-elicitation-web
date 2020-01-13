'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const _ = require('lodash');

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

const placeboLabelInput = '#label-input-0';
const fluoxLabelInput = '#label-input-1';
const venlaLabelInput = '#label-input-2';

function checkDefaultNames(browser) {
  browser
    .getValue(placeboLabelInput, _.partial(checkLabel, browser, 'Placebo'))
    .getValue(fluoxLabelInput, _.partial(checkLabel, browser, 'Fluoxetine'))
    .getValue(venlaLabelInput, _.partial(checkLabel, browser, 'Venlafaxine'));
  return browser;
}

function checkLabel(browser, expectedValue, result) {
  browser.assert.equal(result.value, expectedValue);
}

function setSingleLetterNames(browser) {
  browser
    .click('#single-letter-button')
    .getValue(placeboLabelInput, _.partial(checkLabel, browser, 'A'))
    .getValue(fluoxLabelInput, _.partial(checkLabel, browser, 'B'))
    .getValue(venlaLabelInput, _.partial(checkLabel, browser, 'C'));
  return browser;
}

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0);
  errorService.isErrorBarHidden(browser).end();
}

function changeAlternativeLabels(browser) {
  const legendButton = '//*[@id="value-profile-container"]/div[2]/button';
  const firstAlternative = '#measurements-sensitivity-plot > div:nth-child(1) > svg:nth-child(1) > g:nth-child(4) > g:nth-child(1) > text:nth-child(1)';
  const secondAlternative = '#measurements-sensitivity-plot > div:nth-child(1) > svg:nth-child(1) > g:nth-child(4) > g:nth-child(2) > text:nth-child(1)';
  const thirdAlternative = '#measurements-sensitivity-plot > div:nth-child(1) > svg:nth-child(1) > g:nth-child(4) > g:nth-child(3) > text:nth-child(1)';

  browser
    .click('#deterministic-tab')
    .waitForElementVisible('#sensitivity-table')
    .useXpath()
    .click(legendButton)
    .useCss();

  checkDefaultNames(browser);
  setSingleLetterNames(browser)
    .clearValue(placeboLabelInput)
    .setValue(placeboLabelInput, 'plac')
    .getValue(placeboLabelInput, _.partial(checkLabel, browser, 'plac'))

    .click('#save-legend-button')
    .pause(500)
    .waitForElementVisible('#sensitivity-measurements-header')
    .waitForElementVisible(firstAlternative)
    .assert.containsText(firstAlternative, 'plac')
    .assert.containsText(secondAlternative, 'B')
    .assert.containsText(thirdAlternative, 'C');
}

function reset(browser) {
  const legendButton = '//*[@id="value-profile-container"]/div[2]/button';
  const firstAlternative = '#measurements-sensitivity-plot > div:nth-child(1) > svg:nth-child(1) > g:nth-child(4) > g:nth-child(1) > text:nth-child(1)';
  const secondAlternative = '#measurements-sensitivity-plot > div:nth-child(1) > svg:nth-child(1) > g:nth-child(4) > g:nth-child(2) > text:nth-child(1)';
  const thirdAlternative = '#measurements-sensitivity-plot > div:nth-child(1) > svg:nth-child(1) > g:nth-child(4) > g:nth-child(3) > text:nth-child(1)';

  browser
    .click('#deterministic-tab')
    .waitForElementVisible('#sensitivity-table')
    .useXpath()
    .click(legendButton)
    .useCss();

  setSingleLetterNames(browser)
    .click('#save-legend-button')
    .pause(500)
    .waitForElementVisible('#sensitivity-measurements-header')
    .waitForElementVisible(firstAlternative)
    .assert.containsText(firstAlternative, 'A')
    .assert.containsText(secondAlternative, 'B')
    .assert.containsText(thirdAlternative, 'C')

    .click('#deterministic-tab')
    .waitForElementVisible('#sensitivity-table')
    .useXpath()
    .click(legendButton)
    .useCss()
    .click('#reset-labels-button');

  checkDefaultNames(browser)
    .click('#save-legend-button')
    .pause(500)
    .waitForElementVisible('#sensitivity-measurements-header');
}

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Changing alternatives to generated labels in deterministic view': changeAlternativeLabels,
  'Reset labels': reset
};

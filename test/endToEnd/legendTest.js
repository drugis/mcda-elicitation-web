'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const chai = require('chai');
const _ = require('lodash');

const testUrl = require('./util/constants').testUrl;

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function checkLabel(expectedValue, result) {
  chai.expect(result.value).to.equal(expectedValue);
}

const placeboLabelInput = '#label-input-38deaf60-9014-4af9-997e-e5f08bc8c8ff';
const fluoxLabelInput = '#label-input-a85db1a0-c045-46b4-958b-eddce3793420';
const venlaLabelInput = '#label-input-a266d343-4821-47dd-923f-6fff7c32f9fa';

function checkDefaultNames(browser) {
  browser
    .getValue(placeboLabelInput, _.partial(checkLabel, 'Placebo'))
    .getValue(fluoxLabelInput, _.partial(checkLabel, 'Fluoxetine'))
    .getValue(venlaLabelInput, _.partial(checkLabel, 'Venlafaxine'));
}

function setSingleLetterNames(browser) {
  browser
    .click('#single-letter-button')
    .getValue(placeboLabelInput, _.partial(checkLabel, 'A'))
    .getValue(fluoxLabelInput, _.partial(checkLabel, 'B'))
    .getValue(venlaLabelInput, _.partial(checkLabel, 'C'));
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('#workspace-0')
      .waitForElementVisible('#workspace-title');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Changing alternatives to generated labels in deterministic view': function(browser) {
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
    setSingleLetterNames(browser);

    browser
      .clearValue(placeboLabelInput)
      .setValue(placeboLabelInput, 'plac')
      .getValue(placeboLabelInput, _.partial(checkLabel, 'plac'))

      .click('#save-legend-button')
      .pause(500)
      .waitForElementVisible('#sensitivity-measurements-header')
      .waitForElementVisible(firstAlternative)
      .assert.containsText(firstAlternative, 'plac')
      .assert.containsText(secondAlternative, 'B')
      .assert.containsText(thirdAlternative, 'C');
  },

  'Changing alternatives to generated labels in smaa view': function(browser) {
    const legendButton = '//*[@id="rank-plot-container"]/div[2]/button';
    const firstAlternative = '#alternatives-per-rank-bar-chart > div:nth-child(1) > svg:nth-child(1) > g:nth-child(2) > g:nth-child(6) > g:nth-child(2) > text:nth-child(2) > tspan:nth-child(1)';
    const secondAlternative = '#alternatives-per-rank-bar-chart > div:nth-child(1) > svg:nth-child(1) > g:nth-child(2) > g:nth-child(6) > g:nth-child(3) > text:nth-child(2) > tspan:nth-child(1)';
    const thirdAlternative = '#alternatives-per-rank-bar-chart > div:nth-child(1) > svg:nth-child(1) > g:nth-child(2) > g:nth-child(6) > g:nth-child(4) > text:nth-child(2) > tspan:nth-child(1)';

    browser
      .click('#smaa-tab')
      .waitForElementVisible('#smaa-measurements-header')
      .useXpath()
      .click(legendButton)
      .useCss();

    checkDefaultNames(browser);
    setSingleLetterNames(browser);

    browser
      .clearValue(placeboLabelInput)
      .setValue(placeboLabelInput, 'plac')
      .getValue(placeboLabelInput, _.partial(checkLabel, 'plac'))

      .click('#save-legend-button')
      .pause(500)
      .waitForElementVisible('#smaa-measurements-header')
      .waitForElementVisible(firstAlternative)
      .assert.containsText(firstAlternative, 'plac')
      .assert.containsText(secondAlternative, 'C')
      .assert.containsText(thirdAlternative, 'B');
  },

  'Reset labels': function(browser) {
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

    setSingleLetterNames(browser);

    browser
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

    checkDefaultNames(browser);
    browser
      .click('#save-legend-button')
      .pause(500)
      .waitForElementVisible('#sensitivity-measurements-header');
  }
};

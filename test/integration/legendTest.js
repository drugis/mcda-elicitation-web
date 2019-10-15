'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const chai = require('chai');
const _ = require('lodash');

const testUrl = 'http://localhost:3002';

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
    .getValue(venlaLabelInput, _.partial(checkLabel, 'Venlafaxine'))
    ;
}

function setSingleLetterNames(browser) {
  browser
    .click('#single-letter-button')
    .getValue(placeboLabelInput, _.partial(checkLabel, 'A'))
    .getValue(fluoxLabelInput, _.partial(checkLabel, 'B'))
    .getValue(venlaLabelInput, _.partial(checkLabel, 'C'))
    ;
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Changing alternatives to generated labels in deterministic view': function(browser) {
    const measurementsLegendsButton = '/html/body/div[2]/div/div[3]/div/div/div/div/div[4]/div/div/div/div[6]/div[1]/button[2]';
    const measurementsFirstAlternative = '#measurements-sensitivity-plot > svg:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > text:nth-child(2)';
    const measurementsSecondAlternative = '#measurements-sensitivity-plot > svg:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(2) > text:nth-child(2)';
    const measurementsThirdAlternative = '#measurements-sensitivity-plot > svg:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(3) > text:nth-child(2)';

    browser
      .click('#deterministic-tab')
      .waitForElementVisible('#sensitivity-table')
      .useXpath()
      .click(measurementsLegendsButton)
      .useCss()
      ;

    checkDefaultNames(browser);
    setSingleLetterNames(browser);

    browser
      .clearValue(placeboLabelInput)
      .setValue(placeboLabelInput, 'plac')
      .getValue(placeboLabelInput, _.partial(checkLabel, 'plac'))

      .click('#save-legend-button')
      .pause(500)
      .waitForElementVisible('#sensitivity-measurements-header')
      .waitForElementVisible(measurementsFirstAlternative)
      .assert.containsText(measurementsFirstAlternative, 'plac')
      .assert.containsText(measurementsSecondAlternative, 'B')
      .assert.containsText(measurementsThirdAlternative, 'C')
      ;
  },

  'Changing alternatives to generated labels in smaa view': function(browser) {
    const measurementsLegendsButton = '/html/body/div[2]/div/div[3]/div/div/div/div/div[5]/div/div/div/div[3]/div[3]/button[2]';
    const measurementsFirstAlternative = 'g.nv-legendWrap:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > text:nth-child(2)';
    const measurementsSecondAlternative = 'g.nv-legendWrap:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(2) > text:nth-child(2)';
    const measurementsThirdAlternative = 'g.nv-legendWrap:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(3) > text:nth-child(2)';

    browser
      .click('#smaa-tab')
      .waitForElementVisible('#smaa-measurements-header')
      .useXpath()
      .click(measurementsLegendsButton)
      .useCss()
      ;

    checkDefaultNames(browser);
    setSingleLetterNames(browser);

    browser
      .clearValue(placeboLabelInput)
      .setValue(placeboLabelInput, 'plac')
      .getValue(placeboLabelInput, _.partial(checkLabel, 'plac'))

      .click('#save-legend-button')
      .pause(500)
      .waitForElementVisible('#smaa-measurements-header')
      .waitForElementVisible(measurementsFirstAlternative)
      .assert.containsText(measurementsFirstAlternative, 'plac')
      .assert.containsText(measurementsSecondAlternative, 'C')
      .assert.containsText(measurementsThirdAlternative, 'B')
      ;
  },

  'Reset labels': function(browser) {
    const measurementsLegendsButton = '/html/body/div[2]/div/div[3]/div/div/div/div/div[4]/div/div/div/div[6]/div[1]/button[2]';
    const measurementsFirstAlternative = '#measurements-sensitivity-plot > svg:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > text:nth-child(2)';
    const measurementsSecondAlternative = '#measurements-sensitivity-plot > svg:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(2) > text:nth-child(2)';
    const measurementsThirdAlternative = '#measurements-sensitivity-plot > svg:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(3) > text:nth-child(2)';

    browser
      .click('#deterministic-tab')
      .waitForElementVisible('#sensitivity-table')
      .useXpath()
      .click(measurementsLegendsButton)
      .useCss();

    setSingleLetterNames(browser);

    browser
      .click('#save-legend-button')
      .pause(500)
      .waitForElementVisible('#sensitivity-measurements-header')
      .waitForElementVisible(measurementsFirstAlternative)
      .assert.containsText(measurementsFirstAlternative, 'A')
      .assert.containsText(measurementsSecondAlternative, 'B')
      .assert.containsText(measurementsThirdAlternative, 'C')

      .click('#deterministic-tab')
      .waitForElementVisible('#sensitivity-table')
      .useXpath()
      .click(measurementsLegendsButton)
      .useCss()

      .click('#reset-labels-button')
      ;
    checkDefaultNames(browser);
    browser
      .click('#save-legend-button')
      .pause(500)
      .waitForElementVisible('#sensitivity-measurements-header')
      ;
  }
};

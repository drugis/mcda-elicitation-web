'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const chai = require('chai');

const testUrl = require('./util/constants').testUrl;

function checkElementValueGreaterThan(browser, id, value) {
  browser
    .useXpath()
    .getText('//*[@id="' + id + '"]', function(result) {
      chai.expect(parseFloat(result.value)).to.be.above(value);
    })
    .useCss();
}

function checkRankTable(browser) {
  var placebo;
  var fluox;
  var venla;

  browser
    .useXpath()
    .getText('//*[@id="38deaf60-9014-4af9-997e-e5f08bc8c8ff-1-rank"]', function(result) {
      placebo = parseFloat(result.value);
    })
    .getText('//*[@id="a85db1a0-c045-46b4-958b-eddce3793420-1-rank"]', function(result) {
      fluox = parseFloat(result.value);
      chai.expect(placebo).to.be.above(fluox);
    })
    .getText('//*[@id="a266d343-4821-47dd-923f-6fff7c32f9fa-1-rank"]', function(result) {
      venla = parseFloat(result.value);
      chai.expect(fluox).to.be.above(venla);
    })
    .useCss();
}

module.exports = {
  'SMAA results': function(browser) {
    const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);

    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title')
      .click('#smaa-tab')
      .waitForElementVisible('#smaa-measurements-header')
      .waitForElementVisible('#smaa-table')
      .waitForElementVisible('#rank-plot')
      .waitForElementVisible('#rank-table')
      .waitForElementVisible('#alternatives-per-rank-bar-chart')
      .waitForElementVisible('#rank-per-alternatives-bar-chart')
      .waitForElementVisible('#central-weights-plot')
      .waitForElementVisible('#central-weights-table');

    const measurementElementId = 'de14e778-f723-48d4-8f4e-1e589714f4f2-38deaf60-9014-4af9-997e-e5f08bc8c8ff-measurement';
    const centralWightElementId = '5b99d1e1-116b-4b9f-9aa2-f81eb1976515-38deaf60-9014-4af9-997e-e5f08bc8c8ff-central-weight';

    checkElementValueGreaterThan(browser, measurementElementId, 30);
    checkElementValueGreaterThan(browser, centralWightElementId, 0);
    checkRankTable(browser);

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    errorService.isErrorBarHidden(browser);
    browser.end();
  }
};

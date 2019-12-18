'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const chai = require('chai');

function checkElementValueGreaterThan(browser, id, value) {
  browser.getText(id, function(result) {
    chai.expect(parseFloat(result.value)).to.be.above(value);
  });
}

function checkRankTable(browser) {
  var placebo;
  var fluox;
  var venla;

  browser
    .getText('#alternative-0-rank-1', function(result) {
      placebo = parseFloat(result.value);
    })
    .getText('#alternative-1-rank-1', function(result) {
      fluox = parseFloat(result.value);
      chai.expect(placebo).to.be.above(fluox);
    })
    .getText('#alternative-2-rank-1', function(result) {
      venla = parseFloat(result.value);
      chai.expect(fluox).to.be.above(venla);
    });
}

module.exports = {
  'SMAA results': function(browser) {
    const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

    loginService.login(browser);
    workspaceService.addExample(browser, title)
      .click('#workspace-0')
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

    const measurementElementId = '#criterion-0-alternative-0-measurement';
    const centralWightElementId = '#alternative-0-criterion-0-central-weight';

    checkElementValueGreaterThan(browser, measurementElementId, 30);
    checkElementValueGreaterThan(browser, centralWightElementId, 0);
    checkRankTable(browser);

    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser).end();
  }
};

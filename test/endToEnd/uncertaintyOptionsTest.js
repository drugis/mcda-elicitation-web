'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = require('./util/constants').testUrl;

var deterministicWarning = 'SMAA results will be identical to the deterministic results because there are no stochastic inputs';
var hasNoStochasticWeightsWarning = 'Weights are not stochastic';

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

module.exports = {
  beforeEach: function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title');
  },

  afterEach: function(browser) {
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Both selected by default': function(browser) {
    browser
      .click('#smaa-tab')
      .waitForElementVisible('#uncertainty-measurements-checkbox:checked')
      .waitForElementVisible('#uncertainty-weights-checkbox:checked')
      ;
  },

  'Warning when both deselected': function(browser) {
    browser
      .click('#smaa-tab')
      .click('#uncertainty-measurements-checkbox')
      .click('#uncertainty-weights-checkbox')
      .assert.containsText('#warning-0', deterministicWarning)
      ;
  },

  'Warning when weights are not stochastic': function(browser) {
    browser
      .click('#preferences-tab')
      .click('#precise-swing-button')
      .waitForElementVisible('#swing-weighting-title-header')
      .click('#de14e778-f723-48d4-8f4e-1e589714f4f2-option')
      .click('#next-button')
      .click('#save-button')
      .click('#smaa-tab')
      .waitForElementVisible('#uncertainty-weights-checkbox:disabled')
      .assert.containsText('#warning-0', hasNoStochasticWeightsWarning)
      ;
  },

  'Save settings': function(browser) {
    browser
      .click('#smaa-tab')
      .click('#uncertainty-weights-checkbox')
      .click('#recalculate-button')
      .waitForElementVisible('#uncertainty-measurements-checkbox:checked')
      .assert.elementNotPresent('#uncertainty-weights-checkbox:checked')
      ;
  }
};

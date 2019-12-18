'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const TEST_URL = require('./util/constants').TEST_URL;
const util = require('./util/util');

const chai = require('chai');

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function goToPreferences(browser) {
  browser
    .click('#create-workspace-button')
    .click('#add-workspace-button');
  return util.delayedClick(browser, '#preferences-tab', '#partial-value-functions-header');
}

function cleanUpWorkspace(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0);
  errorService.isErrorBarHidden(browser);
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
  },

  afterEach: function(browser) {
    browser.end();
  },

  'Login page': function(browser) {
    browser
      .url(TEST_URL)
      .waitForElementVisible('#signinButton')
      .getTitle(function(result) {
        chai.expect(result).to.equal('mcda.drugis.org');
      });
    errorService.isErrorBarNotPresent(browser);
  },

  'Workspaces': function(browser) {
    loginService.login(browser)
      .pause(3000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Workspaces');
      });
    errorService.isErrorBarHidden(browser);
  },

  'A workspace overview': function(browser) {
    loginService.login(browser)
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s overview');
      });
    cleanUpWorkspace(browser);
  },

  'A workspace problem definition': function(browser) {
    loginService.login(browser)
      .click('#create-workspace-button')
      .click('#add-workspace-button');

    util.delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s problem definition');
      });
    cleanUpWorkspace(browser);
  },

  'A workspace preferences': function(browser) {
    loginService.login(browser);
    goToPreferences(browser)
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s preferences');
      });
    cleanUpWorkspace(browser);
  },

  'A workspace deterministic results': function(browser) {
    loginService.login(browser)
      .click('#create-workspace-button')
      .click('#add-workspace-button');

    util.delayedClick(browser, '#deterministic-tab', '#sensitivity-measurements-header')
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s deterministic results');
      });
    cleanUpWorkspace(browser);
  },

  'A workspace SMAA results': function(browser) {
    loginService.login(browser)
      .click('#create-workspace-button')
      .click('#add-workspace-button');

    util.delayedClick(browser, '#smaa-tab', '#smaa-measurements-header')
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s SMAA results');
      });
    cleanUpWorkspace(browser);
  },

  'Partial value function': function(browser) {
    loginService.login(browser);
    goToPreferences(browser)
      .click('#criterion-0-pvf-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Treatment responders\'s partial value function');
      });
    cleanUpWorkspace(browser);
  },

  'Ranking weights': function(browser) {
    loginService.login(browser);
    goToPreferences(browser)
      .click('#ranking-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Ranking');
      });
    cleanUpWorkspace(browser);
  },

  'Matching weights': function(browser) {
    loginService.login(browser);
    goToPreferences(browser)
      .click('#matching-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Matching');
      });
    cleanUpWorkspace(browser);
  },

  'Precise swing weighting': function(browser) {
    loginService.login(browser);
    goToPreferences(browser)
      .click('#precise-swing-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Precise swing weighting');
      });
    cleanUpWorkspace(browser);
  },

  'Imprecise swing weighting': function(browser) {
    loginService.login(browser);
    goToPreferences(browser)
      .click('#imprecise-swing-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Imprecise swing weighting');
      });
    cleanUpWorkspace(browser);
  },

  'Manual input': function(browser) {
    loginService.login(browser)
      .click('#create-workspace-button')
      .click('#manual-workspace-radio')
      .click('#add-workspace-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Manual input');
      });
    errorService.isErrorBarHidden(browser);
  },

  'Manual input in progress': function(browser) {
    loginService.login(browser)
      .click('#create-workspace-button')
      .click('#manual-workspace-radio')
      .click('#add-workspace-button')
      .setValue('#workspace-title', 'title')
      .click('#step1-save-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Manual input');
      });
    browser.click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
  }
};

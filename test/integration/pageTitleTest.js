'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const testUrl = 'http://localhost:3002';

const chai = require('chai');

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    // loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
  },

  afterEach: function(browser) {
    browser.end();
  },

  'Login page': function(browser) {
    browser
      .url(testUrl)
      .waitForElementVisible('#signinButton')
      .getTitle(function(result) {
        chai.expect(result).to.equal('mcda.drugis.org');
      });
  },

  'Workspaces': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .pause(3000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Workspaces');
      });
  },

  'A workspace overview': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s overview');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'A workspace problem definition': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#problem-definition-tab')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s problem definition');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'A workspace preferences': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#preferences-tab')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s preferences');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'A workspace deterministic results': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#deterministic-tab')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s deterministic results');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'A workspace SMAA results': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#smaa-tab')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal(title + '\'s SMAA results');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'Partial value function': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#preferences-tab')
      .click('#de14e778-f723-48d4-8f4e-1e589714f4f2-pvf-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Treatment responders\'s partial value function');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'Ranking weights': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#preferences-tab')
      .click('#ranking-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Ranking');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'Matching weights': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#preferences-tab')
      .click('#matching-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Matching');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'Precise swing weighting': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#preferences-tab')
      .click('#precise-swing-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Precise swing weighting');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'Imprecise swing weighting': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#add-workspace-button')
      .click('#preferences-tab')
      .click('#imprecise-swing-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Imprecise swing weighting');
      });
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
  },

  'Manual input': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .click('#create-workspace-button')
      .click('#manual-workspace-radio')
      .click('#add-workspace-button')
      .pause(2000)
      .getTitle(function(result) {
        chai.expect(result).to.equal('Manual input');
      });
  },

  'Manual input in progress': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
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
    workspaceService.deleteUnfinishedFromList(browser, 'title');
  }
};

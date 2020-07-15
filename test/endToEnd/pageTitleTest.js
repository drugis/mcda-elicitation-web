'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Login page': loginPage,
  Workspaces: workspaces,
  'A workspace overview': overview,
  'A workspace problem definition': problemDefition,
  'A workspace preferences': preferences,
  'A workspace deterministic results': deterministicResults,
  'A workspace SMAA results': smaaResults,
  'Partial value function': partialValueFunction,
  'Ranking weights': rankingWeights,
  'Matching weights': matchingWeights,
  'Precise swing weighting': preciseSwingWeights,
  'Imprecise swing weighting': impreciseSwingWeights
  // "Manual input": manualInput,
  // "Manual input in progress": manualInputInProgress,
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const TEST_URL = require('./util/constants').TEST_URL;
const util = require('./util/util');

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function goToPreferences(browser) {
  browser.click('#create-workspace-button').click('#add-workspace-button');
  return util.delayedClick(
    browser,
    '#preferences-tab',
    '#partial-value-functions-header'
  );
}

function cleanUpWorkspace(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0);
}

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
}

function afterEach(browser) {
  browser.end();
}

function loginPage(browser) {
  browser
    .url(TEST_URL)
    .waitForElementVisible('#signinButton')
    .getTitle(function (result) {
      browser.assert.equal(result, 'mcda.drugis.org');
    });
  errorService.isErrorBarNotPresent(browser);
}

function workspaces(browser) {
  loginService
    .login(browser)
    .pause(5000)
    .getTitle(function (result) {
      browser.assert.equal(result, 'Workspaces');
    });
  errorService.isErrorBarHidden(browser);
}

function overview(browser) {
  loginService
    .login(browser)
    .click('#create-workspace-button')
    .click('#add-workspace-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, title + "'s overview");
    });
  cleanUpWorkspace(browser);
}

function problemDefition(browser) {
  loginService
    .login(browser)
    .click('#create-workspace-button')
    .click('#add-workspace-button');

  util
    .delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
    .getTitle(function (result) {
      browser.assert.equal(result, title + "'s problem definition");
    });
  cleanUpWorkspace(browser);
}

function preferences(browser) {
  loginService.login(browser);
  goToPreferences(browser)
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, title + "'s preferences");
    });
  cleanUpWorkspace(browser);
}

function deterministicResults(browser) {
  loginService
    .login(browser)
    .click('#create-workspace-button')
    .click('#add-workspace-button');

  util
    .delayedClick(
      browser,
      '#deterministic-tab',
      '#sensitivity-measurements-header'
    )
    .getTitle(function (result) {
      browser.assert.equal(result, title + "'s deterministic results");
    });
  cleanUpWorkspace(browser);
}

function smaaResults(browser) {
  loginService
    .login(browser)
    .click('#create-workspace-button')
    .click('#add-workspace-button');

  util
    .delayedClick(browser, '#smaa-tab', '#smaa-measurements-header')
    .getTitle(function (result) {
      browser.assert.equal(result, title + "'s SMAA results");
    });
  cleanUpWorkspace(browser);
}

function partialValueFunction(browser) {
  loginService.login(browser);
  goToPreferences(browser)
    .click('#criterion-0-pvf-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(
        result,
        "Treatment responders's partial value function"
      );
    });
  cleanUpWorkspace(browser);
}

function rankingWeights(browser) {
  loginService.login(browser);
  goToPreferences(browser)
    .click('#ranking-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, 'Ranking');
    });
  cleanUpWorkspace(browser);
}

function matchingWeights(browser) {
  loginService.login(browser);
  goToPreferences(browser)
    .click('#matching-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, 'Matching');
    });
  cleanUpWorkspace(browser);
}

function preciseSwingWeights(browser) {
  loginService.login(browser);
  goToPreferences(browser)
    .click('#precise-swing-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, 'Precise swing weighting');
    });
  cleanUpWorkspace(browser);
}

function impreciseSwingWeights(browser) {
  loginService.login(browser);
  goToPreferences(browser)
    .click('#imprecise-swing-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, 'Imprecise swing weighting');
    });
  cleanUpWorkspace(browser);
}

function manualInput(browser) {
  loginService
    .login(browser)
    .click('#create-workspace-button')
    .click('#manual-workspace-radio')
    .click('#add-workspace-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, 'Manual input');
    });
  errorService.isErrorBarHidden(browser);
}

function manualInputInProgress(browser) {
  loginService
    .login(browser)
    .click('#create-workspace-button')
    .click('#manual-workspace-radio')
    .click('#add-workspace-button')
    .setValue('#workspace-title', 'title')
    .click('#step1-save-button')
    .pause(2000)
    .getTitle(function (result) {
      browser.assert.equal(result, 'Manual input');
    });
  browser.click('#logo');
  workspaceService.deleteUnfinishedFromList(browser, 0);
  errorService.isErrorBarHidden(browser);
}

'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Both selected by default': defaultSelection,
  'Warning when both deselected': bothDeselectedWarning,
  'Warning when weights are not stochastic': stochasticWeightsWarning,
  'Save settings': save
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const {TEST_URL} = require('./util/constants');

var deterministicWarning =
  'SMAA results will be identical to the deterministic results because there are no stochastic inputs';
var hasNoStochasticWeightsWarning = 'Weights are not stochastic';

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function defaultSelection(browser) {
  browser.click('#smaa-tab');
  browser.expect.element('#measurements-uncertainty-checkbox').to.be.selected;
  browser.expect.element('#weights-uncertainty-checkbox').to.be.selected;
}

function bothDeselectedWarning(browser) {
  browser
    .click('#smaa-tab')
    .click('#measurements-uncertainty-checkbox')
    .click('#weights-uncertainty-checkbox')
    .assert.containsText('#smaa-results-warning-0', deterministicWarning);
}

function stochasticWeightsWarning(browser) {
  browser
    .click('#preferences-tab')
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#criterion-option-treatmentRespondersId')
    .click('#next-button')
    .click('#save-button')
    .waitForElementVisible('#precise-swing-button')
    .getAttribute('#smaa-tab', 'href', (result) => {
      const smaaUrl = TEST_URL + '/' + result.value;
      browser.url(smaaUrl); // does not work via delayed click -- smaa tab is not clickable
    });
  browser.assert.containsText(
    '#smaa-results-warning-0',
    hasNoStochasticWeightsWarning
  );
}

function save(browser) {
  browser
    .click('#smaa-tab')
    .click('#weights-uncertainty-checkbox')
    .click('#recalculate-button');
  browser.expect.element('#measurements-uncertainty-checkbox').to.be.selected;
  browser.expect.element('#weights-uncertainty-checkbox').to.not.be.selected;
}

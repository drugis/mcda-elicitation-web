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
const errorService = require('./util/errorService');

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
  browser
    .click('#smaa-tab')
    .waitForElementVisible('#uncertainty-measurements-checkbox:checked')
    .waitForElementVisible('#uncertainty-weights-checkbox:checked');
}

function bothDeselectedWarning(browser) {
  browser
    .click('#smaa-tab')
    .click('#uncertainty-measurements-checkbox')
    .click('#uncertainty-weights-checkbox')
    .assert.containsText('#warning-0', deterministicWarning);
}

function stochasticWeightsWarning(browser) {
  browser
    .click('#preferences-tab')
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#swing-option-0')
    .click('#next-button')
    .click('#save-button')
    .waitForElementVisible('#precise-swing-button')
    .click('#smaa-tab')

    .waitForElementVisible('#uncertainty-weights-checkbox:disabled')
    .assert.containsText('#warning-0', hasNoStochasticWeightsWarning);
}

function save(browser) {
  browser
    .click('#smaa-tab')
    .click('#uncertainty-weights-checkbox')
    .click('#recalculate-button')
    .waitForElementVisible('#uncertainty-measurements-checkbox:checked')
    .assert.not.elementPresent('#uncertainty-weights-checkbox:checked');
}

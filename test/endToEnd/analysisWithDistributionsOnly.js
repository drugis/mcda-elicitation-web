'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Entered deterministic effects view is disabled': disabledSettings,
  'Show values for deterministic analysis view based on scales': showAnalysisValues
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const firstCell = '#value-cell-ds1-alt1';
const secondCell = '#value-cell-ds1-alt2';
const thirdCell = '#value-cell-ds2-alt1';
const fourthCell = '#value-cell-ds2-alt2';

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(
    browser,
    '/onlyDistributionsProblem.json'
  );
  util.delayedClick(
    browser,
    '#problem-definition-tab',
    '#effects-table-header'
  );
}

function afterEach(browser) {
  errorService.isErrorBarHidden(browser);
  util.delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function disabledSettings(browser) {
  browser
    .click('#settings-button')
    .click('#entered-radio')
    .click('#deterministic-radio')
    .waitForElementVisible('#save-settings-button:disabled')
    .click('#close-modal-button');
}

function showAnalysisValues(browser) {
  browser
    .click('#settings-button')
    .click('#values-radio')
    .click('#deterministic-radio')
    .click('#save-settings-button')
    .assert.containsText(firstCell, 0)
    .assert.containsText(secondCell, 1)
    .assert.containsText(thirdCell, 2)
    .assert.containsText(fourthCell, 3);
}

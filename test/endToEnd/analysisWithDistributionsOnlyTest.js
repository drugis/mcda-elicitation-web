'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Entered deterministic effects view is disabled': disabledSettings,
  'Show values for deterministic analysis view based on scales': showAnalysisValues,
  'Do not display mode for range distribution': noModeForRange
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const betaCell = '#value-cell-ds1-alt1';
const gammaCell = '#value-cell-ds1-alt2';
const normalCell = '#value-cell-ds2-alt1';
const rangeCell = '#value-cell-ds2-alt2';
const studentsTCell = '#value-cell-ds1-alt3';

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
    .click('#save-settings-button');
  browser.expect.element(betaCell).text.to.equal('0.33');
  browser.expect.element(gammaCell).text.to.equal('0.595');
  browser.expect.element(studentsTCell).text.to.equal('4.997');
  browser.expect.element(normalCell).text.to.equal('5');
  browser.expect.element(rangeCell).text.to.equal('3');
}

function noModeForRange(browser) {
  const betaCellPath = '//*[@id="value-cell-ds1-alt1"]/div/div';
  const gammaCellPath = '//*[@id="value-cell-ds1-alt2"]/div/div';
  const studentsTCellPath = '//*[@id="value-cell-ds1-alt3"]/div/div';
  const normalCellPath = '//*[@id="value-cell-ds2-alt1"]/div/div';
  const rangeCellPath = '//*[@id="value-cell-ds2-alt2"]';

  browser
    .click('#settings-button')
    .click('#values-radio')
    .click('#smaa-radio')
    .click('#show-mode-radio')
    .click('#save-settings-button')
    .useXpath();

  browser.expect.element(betaCellPath + '[1]').text.to.equal('0.321');
  browser.expect.element(betaCellPath + '[2]').text.to.equal('0.179, 0.508');

  browser.expect.element(gammaCellPath + '[1]').text.to.equal('0.58');
  browser.expect.element(gammaCellPath + '[2]').text.to.equal('0.407, 0.833');

  browser.expect.element(studentsTCellPath + '[1]').text.to.equal('4.904');
  browser.expect
    .element(studentsTCellPath + '[2]')
    .text.to.equal('2.829, 7.155');

  browser.expect.element(normalCellPath + '[1]').text.to.equal('5');
  browser.expect.element(normalCellPath + '[2]').text.to.equal('4.02, 5.98');

  browser.expect.element(rangeCellPath).text.to.equal('NA');

  browser.useCss();
}

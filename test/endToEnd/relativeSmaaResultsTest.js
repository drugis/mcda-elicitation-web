'use strict';

module.exports = {
  'SMAA results for relative problem': checkRelativeSmaaResults
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');

function checkRelativeSmaaResults(browser) {
  const title =
    'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)';

  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .click('#smaa-tab')
    .waitForElementVisible('#smaa-measurements-header')
    .waitForElementVisible('#smaa-table')
    .waitForElementVisible('#rank-plot')
    .waitForElementVisible('#rank-table')
    .waitForElementVisible('#central-weights-plot')
    .waitForElementVisible('#central-weights-table');

  const measurementElementId = '#criterion-0-alternative-0-measurement';
  const centralWightElementId = '#alternative-0-criterion-0-central-weight';
  browser.assert.containsText(measurementElementId, '45.7');
  browser.assert.containsText(centralWightElementId, '0.09');
  checkRankTable(browser);

  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function checkRankTable(browser) {
  browser.assert
    .containsText('#alternative-0-rank-1', '0.604')
    .assert.containsText('#alternative-1-rank-1', '0.021')
    .assert.containsText('#alternative-2-rank-1', '0.151')
    .assert.containsText('#alternative-3-rank-1', '0.083')
    .assert.containsText('#alternative-4-rank-1', '0.141');
}

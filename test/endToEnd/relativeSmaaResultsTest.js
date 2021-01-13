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
    .waitForElementVisible('#effects-table-header')
    .waitForElementVisible('#effects-table')
    .waitForElementVisible('#rank-acceptabilities-plot')
    .waitForElementVisible('#rank-acceptabilities-table')
    .waitForElementVisible('#central-weights-plot')
    .waitForElementVisible('#central-weights-table');

  const centralWightElementId = '#central-weight-Placebo-HAM-D';
  browser.assert.containsText(centralWightElementId, '0.0904');
  checkRankTable(browser);

  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function checkRankTable(browser) {
  browser.assert
    .containsText('#rank-Placebo-0', '0.604')
    .assert.containsText('#rank-Fluox-0', '0.0213')
    .assert.containsText('#rank-Parox-0', '0.151')
    .assert.containsText('#rank-Sertra-0', '0.0828')
    .assert.containsText('#rank-Venla-0', '0.141');
}

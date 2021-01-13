'use strict';
module.exports = {
  'SMAA results': smaaResults
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');

function smaaResults(browser) {
  const title =
    'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

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

  const centralWightElementId =
    '#central-weight-placeboId-treatmentRespondersId';
  browser.assert.containsText(centralWightElementId, '0.187');

  browser.assert.containsText('#rank-placeboId-0', '0.743');
  browser.assert.containsText('#rank-placeboId-1', '0.166');
  browser.assert.containsText('#rank-placeboId-2', '0.0909');

  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

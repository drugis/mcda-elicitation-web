'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

module.exports = {
  'Warning when measurements are not stochastic': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';

    loginService.login(browser);
    workspaceService.addExample(browser, title)
      .click('#workspace-0')
      .waitForElementVisible('#workspace-title')
      .click('#smaa-tab')
      .waitForElementVisible('#uncertainty-measurements-checkbox:disabled')
      .assert.containsText('#warning-0', 'Measurements are not stochastic');

    browser.click('#logo');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser).end();
  }
};

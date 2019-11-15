'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = require('./util/constants').testUrl;

var hasNoStochasticMeasurementsWarning = 'Measurements are not stochastic';

module.exports = {
  'Warning when measurements are not stochastic': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);

    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title')
      .click('#smaa-tab')
      .waitForElementVisible('#uncertainty-measurements-checkbox:disabled')
      .assert.containsText('#warning-0', hasNoStochasticMeasurementsWarning)
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    errorService.isErrorBarHidden(browser);
    browser.end();
  }
};

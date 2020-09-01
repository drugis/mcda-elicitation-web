'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const errorService = require('./util/errorService.js');

module.exports = {
  test: function (browser) {
    const title =
      'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

    loginService.login(browser);
    workspaceService.cleanList(browser);
    browser
      .waitForElementVisible('#create-workspace-button')
      .click('#create-workspace-button')
      .click('#example-workspace-radio')
      .click('#example-workspace-selector')
      .click('option[label="' + title + '"]')
      .click('#add-workspace-button')
      .pause(500)
      .source((result) => {
        console.log(result.value);
      });
    errorService
      .isErrorBarHidden(browser)
      .assert.containsText('#workspace-title', title);
    util
      .delayedClick(browser, '#logo', '#workspaces-header')
      .waitForElementVisible('#workspaces-header')
      .click('#delete-workspace-0')
      .click('#delete-workspace-confirm-button');
    errorService.isErrorBarHidden(browser);
    browser.end();
  }
};

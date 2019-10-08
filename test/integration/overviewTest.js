'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = 'http://localhost:3002';

function loadTestWorkspace(browser, title) {
  workspaceService.addExample(browser, title);
  browser
    .click('a[id="' + title + '"]')
    .waitForElementVisible('#workspace-title');

  errorService.isErrorBarHidden(browser);
}



module.exports = {
  'The overview tab': function(browser) {
    const title = 'Thrombolytics - single study B/R analysis';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      // .waitForElementVisible('#criterion-title-Proximal\ DVT')
      .waitForElementVisible('#alternative-title-cfcdf6df-f231-4c3d-be83-64aa28d8d5f1')
      // .assert.containsText('#criterion-description-Proximal\ DVT', 'Proximal deep vein thrombolytic events, often associated with serious complications.')
      .useXpath()
      .assert.containsText('//div[1]/div[2]/criterion-card//table//td[3]//*', '40 / 136')
      .useCss()
      // .waitForElementVisible('#criterion-title-Treatment\ responders')
      // .waitForElementVisible('#criterion-title-Treatment\ responders')
      // .waitForElementVisible('#criterion-title-Treatment\ responders')
      // .waitForElementVisible('#criterion-title-Treatment\ responders')

      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },
  'Editing the therapeutic context': function(browser) {
    const title = 'Thrombolytics - single study B/R analysis';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .assert.containsText('#therapeutic-context', 'No description given.')
      .click('#edit-therapeutic-context-button')
      .waitForElementVisible('#therapeutic-context-header')

      .setValue('#therapeutic-context-input', 'new context')
      .click('#save-button')
      .assert.containsText('#therapeutic-context', 'new context')
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  }
};

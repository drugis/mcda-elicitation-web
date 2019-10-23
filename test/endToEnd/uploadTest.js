'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const errorService = require('./util/errorService');

const testUrl = require('./util/constants').testUrl;

module.exports = {
  'Upload a workspace': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';
    const workspacePath = '../../../../examples/getreal.json';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.uploadTestWorkspace(browser, workspacePath);

    browser
      .assert.containsText('#workspace-title', title)
      .click('#logo');

    workspaceService.deleteFromList(browser, title);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },
};

'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const errorService = require('./util/errorService');
const util = require('./util/util');

module.exports = {
  'Upload a workspace': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';
    const workspacePath = '../../../../examples/getreal.json';

    loginService.login(browser);
    workspaceService.uploadTestWorkspace(browser, workspacePath);
    browser.assert.containsText('#workspace-title', title);
    util.delayedClick(browser, '#logo', '#workspaces-header');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser).end();
  },
};

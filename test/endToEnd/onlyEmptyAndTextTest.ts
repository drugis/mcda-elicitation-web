'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const util = require('./util/util');

module.exports = {
  'Test workspace with only empty and text effects': function (browser) {
    const title = 'Only text and empty workspace';
    const workspacePath = '/onlyEmptyAndText.json';

    loginService.login(browser);
    workspaceService.cleanList(browser);
    workspaceService.uploadTestWorkspace(browser, workspacePath);
    browser.assert.containsText('#workspace-title', title);
    util.delayedClick(browser, '#logo', '#workspaces-header');
    workspaceService.deleteFromList(browser, 0).end();
  }
};

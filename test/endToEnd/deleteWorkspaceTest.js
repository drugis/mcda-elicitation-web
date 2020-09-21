'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

module.exports = {
  'Delete a workspace': function (browser) {
    const title =
      'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

    loginService.login(browser);
    workspaceService.cleanList(browser);
    workspaceService.addExample(browser, title);
    workspaceService.deleteFromList(browser, 0);
    browser.waitForElementVisible('#empty-workspace-message');
    browser.end();
  }
};

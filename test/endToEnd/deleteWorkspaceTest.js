'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const errorService = require('./util/errorService');

module.exports = {
  'Delete a workspace' : function (browser) {
    const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
    
    loginService.login(browser);
    browser.waitForElementVisible('#empty-workspace-message');
    workspaceService.addExample(browser, title);
    workspaceService.deleteFromList(browser, 0);
    browser.waitForElementVisible('#empty-workspace-message');
    errorService.isErrorBarHidden(browser);
    browser.end();
  }
};

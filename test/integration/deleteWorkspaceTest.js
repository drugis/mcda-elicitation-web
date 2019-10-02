'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

const testUrl = 'http://localhost:3002';

module.exports = {
  'Delete a workspace' : function (browser) {
    const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
    
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser.waitForElementVisible('#empty-workspace-message');
    workspaceService.addExample(browser, title);
    workspaceService.deleteFromList(browser, title);
    browser.waitForElementVisible('#empty-workspace-message');
      
    browser.end();
  }
};
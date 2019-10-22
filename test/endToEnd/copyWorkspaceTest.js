'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

const testUrl = require('./util/constants').testUrl;

module.exports = {
  'Copy a workspace' : function (browser) {
    const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
    const newTitle = 'copy of a workspace';
    
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    workspaceService.copy(browser, title, newTitle);
    workspaceService.deleteFromList(browser, newTitle);
    workspaceService.deleteFromList(browser, title);
      
    browser.end();
  }
};

'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

const testUrl = 'http://localhost:3002';

module.exports = {
  'Add Lixisenatide simplified tutorial' : function (browser) {
    const title = 'Lixisenatide simplified';
    
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addTutorial(browser, title);
    workspaceService.deleteFromList(browser, title);
      
    browser.end();
  },

  'Add Zinbryta initial assessment simplified tutorial' : function (browser) {
    const title = 'Zinbryta initial assessment simplified';
    
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addTutorial(browser, title);
    workspaceService.deleteFromList(browser, title);
      
    browser.end();
  },

  'Add Zinbryta initial assessment simplified, stochastic tutorial' : function (browser) {
    const title = 'Zinbryta initial assessment simplified, stochastic';
    
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addTutorial(browser, title);
    workspaceService.deleteFromList(browser, title);
      
    browser.end();
  }
};
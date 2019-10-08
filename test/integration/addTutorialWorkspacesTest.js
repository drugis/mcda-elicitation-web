'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

function testTutorial(browser, title) {
  const testUrl = 'http://localhost:3002';
  loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
  workspaceService.addTutorial(browser, title);
  workspaceService.deleteFromList(browser, title);
  browser.end();
}

module.exports = {
  'Add Lixisenatide simplified tutorial': function(browser) {
    const title = 'Lixisenatide simplified';
    testTutorial(browser, title);
  },

  'Add Zinbryta initial assessment simplified tutorial': function(browser) {
    const title = 'Zinbryta initial assessment simplified';
    testTutorial(browser, title);
  },

  'Add Zinbryta initial assessment simplified, stochastic tutorial': function(browser) {
    const title = 'Zinbryta initial assessment simplified, stochastic';
    testTutorial(browser, title);
  }
};

'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const errorService = require('./util/errorService');

function testTutorial(browser, title) {
  loginService.login(browser);
  workspaceService.addTutorial(browser, title);
  workspaceService.deleteFromList(browser, 0);
}

module.exports = {
  afterEach: function(browser) {
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

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

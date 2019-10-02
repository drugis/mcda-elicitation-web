'use strict';

const loginService = require('./util/loginService.js');

const testUrl = 'http://localhost:3002';

module.exports = {
  'MCDA login success': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .pause(1000)
      .assert.containsText('h3', 'Workspaces')
      .end();
  },

  'MCDA login fail': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.incorrectPassword);
    browser
      .pause(1000)
      .assert.containsText('#loginWarning', 'Incorrect username or password.')
      .end();
  }
};
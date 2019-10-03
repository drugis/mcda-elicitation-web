'use strict';

const loginService = require('./util/loginService.js');

const testUrl = 'http://localhost:3002';

module.exports = {
  'MCDA login success': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    browser
      .waitForElementVisible('#workspaces-header')
      .end();
  },

  'MCDA login fail': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.incorrectPassword);
    browser
      .waitForElementVisible('#loginWarning')
      .end();
  }
};
'use strict';

const loginService = require('./util/loginService.js');
const errorService = require('./util/errorService.js');

const testUrl = 'http://localhost:3002';

module.exports = {
  'MCDA login success': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    errorService.isErrorBarNotPresent(browser);
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
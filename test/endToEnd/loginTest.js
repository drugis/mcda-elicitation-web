'use strict';

const loginService = require('./util/loginService.js');
const errorService = require('./util/errorService.js');

module.exports = {
  'MCDA login success': function(browser) {
    loginService.login(browser);
    errorService.isErrorBarNotPresent(browser);
    browser
      .waitForElementVisible('#workspaces-header')
      .end();
  },

  'MCDA login fail': function(browser) {
    loginService.login(browser, loginService.username, loginService.incorrectPassword);
    browser
      .waitForElementVisible('#loginWarning')
      .end();
  }
};

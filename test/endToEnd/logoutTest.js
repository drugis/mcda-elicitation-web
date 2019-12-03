'use strict';

const loginService = require('./util/loginService.js');

const testUrl = require('./util/constants').testUrl;

module.exports = {
  'MCDA logout': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);

    browser
      .waitForElementVisible('#workspaces-header')
      .moveToElement('#user-image-link', 0, 0)
      .moveToElement('#logout-link', 0, 0)
      .click('#logout-link')
      .waitForElementVisible('#signinButton')
      .end();
  },
};

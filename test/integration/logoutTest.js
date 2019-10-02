'use strict';

const loginService = require('./util/loginService.js');

const testUrl = 'http://localhost:3002';

module.exports = {
  'MCDA logout' : function (browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword)
      // .pause(1000)
      // .moveToElement('#userImageLink', 0, 0)
      // .moveToElement('#logoutLink', 0, 0)
      // .click('#logoutLink')
      // .pause(1000)
      // .waitForElementVisible('#signinButton')
      .end();
  },  
};
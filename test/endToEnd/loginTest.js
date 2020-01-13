'use strict';

const loginService = require('./util/loginService.js');
const errorService = require('./util/errorService.js');

function login(browser) {
  loginService.login(browser);
  errorService.isErrorBarNotPresent(browser);
  browser
    .waitForElementVisible('#workspaces-header')
    .end();
}

function loginFail(browser) {
  loginService.login(browser, 'wrong name', 'wrong password')
    .waitForElementVisible('#loginWarning')
    .end();
}

module.exports = {
  'MCDA login success': login,
  'MCDA login fail': loginFail
};

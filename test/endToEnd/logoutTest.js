'use strict';

const loginService = require('./util/loginService');
const constants = require('./util/constants');

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Logout via user name': logoutViaName,
  'Logout via URL': logoutViaURL,
  'Logout and login with the same user': sameUserLogoutLogin,
  'Logout and login with different users': logoutLoginOtherUser
};

function beforeEach(browser) {
  loginService.login(browser).waitForElementVisible('#workspaces-header');
}

function afterEach(browser) {
  browser.waitForElementVisible('#signinButton').end();
}

function logoutViaName(browser) {
  browser
    .moveToElement('#user-image-link', 0, 0)
    .moveToElement('#logout-link', 0, 0)
    .click('#logout-link');
}

function logoutViaURL(browser) {
  browser.url(constants.TEST_URL + '/logout');
}

function sameUserLogoutLogin(browser) {
  browser
    .url(constants.TEST_URL + '/logout')
    .waitForElementVisible('#signinButton');
  loginService.login(browser).waitForElementVisible('#workspaces-header');
  browser.url(constants.TEST_URL + '/logout');
}

function logoutLoginOtherUser(browser) {
  browser
    .url(constants.TEST_URL + '/logout')
    .waitForElementVisible('#signinButton');

  loginService
    .login(browser, 'user2')
    .waitForElementVisible('#workspaces-header')
    .url(constants.TEST_URL + '/logout');
}

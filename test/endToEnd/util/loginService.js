'use strict';

const TEST_URL = require('./constants').TEST_URL;
const USER_NAME = 'user';
const CORRECT_PASSWORD = 'test';

function login(browser, username = USER_NAME, password = CORRECT_PASSWORD) {
  browser
    .url(TEST_URL)
    .waitForElementVisible('#signinButton')
    .setValue('#username', username)
    .setValue('#password', password)
    .click('#signinButton');
}

module.exports = {
  login: login
};
'use strict';

const username = 'user';
const correctPassword = 'password';
const incorrectPassword = 'notapassword';

function login(browser, url, username, password) {
  browser
    .url(url)
    .waitForElementVisible('#signinButton')
    .setValue('#username', username)
    .setValue('#password', password)
    .click('#signinButton');
}

module.exports = {
  login: login,
  username: username,
  correctPassword: correctPassword,
  incorrectPassword: incorrectPassword
};
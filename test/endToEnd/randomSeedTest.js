'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Set random seed': set,
  'Set invalid random seed': setInvalid
};

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService');

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .click('#settings-button');

  browser.expect.element('#random-seed').value.to.equal('1234');
  browser.clearValue('#random-seed');
}

function afterEach(browser) {
  browser.click('#close-modal-button').click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function set(browser) {
  browser
    .setValue('#random-seed', 1337)
    .click('#save-settings-button')
    .click('#settings-button');
  browser.expect.element('#random-seed').value.to.equal('1337');
}

function setInvalid(browser) {
  browser
    .setValue('#random-seed', 1.5)
    .pause(500) // needed for GitHub Actions
    .waitForElementVisible('#random-seed-helper-text')
    .waitForElementVisible('#save-settings-button:disabled');
}

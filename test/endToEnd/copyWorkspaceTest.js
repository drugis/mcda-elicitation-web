'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const errorService = require('./util/errorService');

const testUrl = require('./util/constants').testUrl;
const NEW_TITLE = 'copy of a workspace';
const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

function beforeEach(browser) {
  loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
  workspaceService.addExample(browser, title);
  workspaceService.copy(browser, 0, NEW_TITLE);
}

function afterEach(browser) {
  workspaceService.deleteFromList(browser, 1);
  workspaceService.deleteFromList(browser, 0);
  errorService.isErrorBarHidden(browser);
  browser.end();
}

function copy(browser) {
  browser
    .click('#enter-data-button')
    .click('#done-button').pause(500);
  workspaceService.goHomeAfterLoading(browser, NEW_TITLE);
}

function copyAndModify(browser) {
  browser
    .click('#enter-data-button')
    .click('#done-button').pause(500);
  workspaceService.goHomeAfterLoading(browser, NEW_TITLE);  
}

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Copy a workspace': copy,
  'Copy and modify a workspace': copyAndModify
};

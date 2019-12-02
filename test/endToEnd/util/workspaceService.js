'use strict';

const errorService = require('./errorService.js');

function goHomeAfterLoading(browser, title) {
  errorService.isErrorBarHidden(browser);
  browser
    .assert.containsText('#workspace-title', title)
    .click('#logo')
    .waitForElementVisible('#workspaces-header');
}

function addExample(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#example-workspace-radio')
    .click('#example-workspace-selector')
    .click('option[label="' + title + '"]')
    .click('#add-workspace-button').pause(500);
  goHomeAfterLoading(browser, title);
}

function addTutorial(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#tutorial-workspace-radio')
    .click('#tutorial-workspace-selector')
    .click('option[label="' + title + '"]')
    .click('#add-workspace-button').pause(500);
  goHomeAfterLoading(browser, title);
}

function copy(browser, index, newTitle) {
  browser
    .click('#copy-workspace-' + index)
    .setValue('#workspace-title', newTitle)
    .click('#enter-data-button')
    .click('#done-button').pause(500);
  goHomeAfterLoading(browser, newTitle);
}

function deleteFromList(browser, index) {
  browser
    .click('#delete-workspace-' + index)
    .click('#delete-workspace-confirm-button');
  errorService.isErrorBarHidden(browser);
}

function uploadTestWorkspace(browser, path) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#upload-workspace-radio')
    .setValue('#workspace-upload-input', require('path').resolve(__dirname + path))
    .click('#add-workspace-button').pause(500);

  errorService.isErrorBarHidden(browser);
}

function deleteUnfinishedFromList(browser, index) {
  browser
    .click('#delete-in-progress-workspace-' + index)
    .click('#delete-workspace-confirm-button');
  errorService.isErrorBarHidden(browser);
}

module.exports = {
  addExample: addExample,
  addTutorial: addTutorial,
  copy: copy,
  deleteFromList: deleteFromList,
  deleteUnfinishedFromList: deleteUnfinishedFromList,
  uploadTestWorkspace: uploadTestWorkspace
};

'use strict';

const errorService = require('./errorService.js');

function addExample(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#example-workspace-radio')
    .click('#example-workspace-selector')
    .click('option[label="' + title + '"]')
    .click('#add-workspace-button').pause(500);

  errorService.isErrorBarHidden(browser);

  browser
    .assert.containsText('#workspace-title', title)
    .click('#logo');
}

function addTutorial(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#tutorial-workspace-radio')
    .click('#tutorial-workspace-selector')
    .click('option[label="' + title + '"]')
    .click('#add-workspace-button').pause(500);

  errorService.isErrorBarHidden(browser);

  browser
    .assert.containsText('#workspace-title', title)
    .click('#logo');
}

function copy(browser, title, newTitle) {
  browser
    .click('a[id="copy-workspace-' + title + '"]')
    .setValue('#workspace-title', newTitle)
    .click('#enter-data-button')
    .click('#done-button').pause(500);

  errorService.isErrorBarHidden(browser);

  browser
    .assert.containsText('#workspace-title', newTitle)
    .click('#logo');
}

function deleteFromList(browser, title) {
  browser
    .click('a[id="delete-workspace-' + title + '"]')
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

module.exports = {
  addExample: addExample,
  addTutorial: addTutorial,
  copy: copy,
  deleteFromList: deleteFromList,
  uploadTestWorkspace: uploadTestWorkspace
};
'use strict';

function addExample(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button').pause(5)
    .click('#example-workspace-radio').pause(5)
    .click('#example-workspace-selector').pause(5)
    .click('option[label="' + title + '"]').pause(5)
    .click('#add-workspace-button').pause(5)
    .assert.containsText('#workspace-title', title)
    .click('#logo').pause(5);
}

function addTutorial(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button').pause(5)
    .click('#create-workspace-button').pause(5)
    .click('#tutorial-workspace-radio').pause(5)
    .click('#tutorial-workspace-selector').pause(5)
    .click('option[label="' + title + '"]').pause(5)
    .click('#add-workspace-button').pause(5)
    .assert.containsText('#workspace-title', title)
    .click('#logo').pause(5);
}

function copy(browser, title, newTitle) {
  browser
    .click('a[id="copy-workspace-' + title + '"]').pause(5)
    .setValue('#workspace-title', newTitle)
    .click('#enter-data-button').pause(5)
    .click('#done-button').pause(5)
    .assert.containsText('#workspace-title', newTitle)
    .click('#logo').pause(5);
}

function deleteFromList(browser, title) {
  browser
    .click('a[id="delete-workspace-' + title + '"]').pause(5)
    .click('#delete-workspace-confirm-button').pause(5);
}

function uploadTestWorkspace(browser, path) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button').pause(5)
    .click('#upload-workspace-radio').pause(5)
    .setValue('#workspace-upload-input', require('path').resolve(__dirname + path))
    .click('#add-workspace-button').pause(5);
}

module.exports = {
  addExample: addExample,
  addTutorial: addTutorial,
  copy: copy,
  deleteFromList: deleteFromList,
  uploadTestWorkspace: uploadTestWorkspace
};
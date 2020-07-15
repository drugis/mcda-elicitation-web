'use strict';

const errorService = require('./errorService.js');
const util = require('./util.js');

function goHomeAfterLoading(browser, title) {
  errorService
    .isErrorBarHidden(browser)
    .assert.containsText('#workspace-title', title);
  return util
    .delayedClick(browser, '#logo', '#workspaces-header')
    .waitForElementVisible('#workspaces-header');
}

function addExample(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#example-workspace-radio')
    .click('#example-workspace-selector')
    .click('option[label="' + title + '"]')
    .click('#add-workspace-button')
    .pause(500);
  return goHomeAfterLoading(browser, title);
}

function addTutorial(browser, title) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#tutorial-workspace-radio')
    .click('#tutorial-workspace-selector')
    .click('option[label="' + title + '"]')
    .click('#add-workspace-button')
    .pause(500);
  return goHomeAfterLoading(browser, title);
}

function copy(browser, index) {
  return browser
    .click('#copy-workspace-' + index)
    .waitForElementVisible('#workspace-title');
}

function deleteFromList(browser, index) {
  browser
    .click('#delete-workspace-' + index)
    .click('#delete-workspace-confirm-button');
  return errorService.isErrorBarHidden(browser);
}

function uploadTestWorkspace(browser, path) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#upload-workspace-radio')
    .setValue(
      '#workspace-upload-input',
      require('path').resolve(__dirname + path)
    )
    .click('#add-workspace-button')
    .pause(500);
  return errorService.isErrorBarHidden(browser);
}

function deleteUnfinishedFromList(browser, index) {
  browser
    .click('#delete-in-progress-workspace-' + index)
    .click('#delete-workspace-confirm-button');
  return errorService.isErrorBarHidden(browser);
}

function cleanList(browser) {
  var expectPath = '#delete-workspace-0';
  browser.waitForElementVisible('#workspaces-header');
  browser.elements('css selector', expectPath, function (result) {
    if (result.value.length !== 0) {
      console.log('! Workspace list is not empty. Deleting a workspace.');
      browser.click(expectPath);
      browser.waitForElementVisible('#delete-workspace-confirm-button');
      browser.click('#delete-workspace-confirm-button');
      cleanList(browser);
    } else {
      console.log('✔ Workspace list is empty.');
    }
  });
  return browser;
}

function cleanUnfinishedList(browser) {
  var expectPath = '#delete-in-progress-workspace-0';
  browser.waitForElementVisible('#workspaces-header');
  browser.elements('css selector', expectPath, function (result) {
    if (result.value.length !== 0) {
      console.log(
        '! Unfinished workspace list is not empty. Deleting an unfinished workspace.'
      );
      browser.click(expectPath);
      browser.waitForElementVisible('#delete-workspace-confirm-button');
      browser.click('#delete-workspace-confirm-button');
      cleanUnfinishedList(browser);
    } else {
      console.log('✔ Unfinished workspace list is empty.');
    }
  });
  return browser;
}

module.exports = {
  addExample: addExample,
  addTutorial: addTutorial,
  copy: copy,
  deleteFromList: deleteFromList,
  deleteUnfinishedFromList: deleteUnfinishedFromList,
  uploadTestWorkspace: uploadTestWorkspace,
  goHomeAfterLoading: goHomeAfterLoading,
  cleanList: cleanList,
  cleanUnfinishedList: cleanUnfinishedList
};

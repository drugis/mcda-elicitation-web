'use strict';

const errorService = require('./errorService.js');
const util = require('./util.js');

function goHomeAfterLoading(browser, title) {
  errorService
    .isErrorBarNotPresent(browser)
    .expect.element('#workspace-title')
    .text.to.equal(title);
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
    .click('option[value="' + title + '"]')
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
    .click('option[value="' + title + '"]')
    .click('#add-workspace-button')
    .pause(500);
  return goHomeAfterLoading(browser, title);
}

function copy(browser, index) {
  return browser
    .waitForElementVisible('#workspaces-header')
    .useXpath()
    .click('//*[@id="copy-workspace-' + index + '"]/span/button')
    .useCss()
    .waitForElementVisible('#workspace-title');
}

function deleteFromList(browser, index) {
  browser
    .useXpath()
    .waitForElementVisible('//*[@id="delete-workspace-' + index + '"]')
    .click('//*[@id="delete-workspace-' + index + '"]/span/button')
    .useCss()
    .click('#delete-workspace-confirm-button');
  return browser;
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
    .pause(300)
    .assert.not.elementPresent('#invalid-schema-error-0')
    .click('#add-workspace-button')
    .pause(500);
  return errorService.isErrorBarNotPresent(browser);
}

function deleteUnfinishedFromList(browser, index) {
  browser
    .click('#delete-in-progress-workspace-' + index)
    .click('#delete-workspace-confirm-button');
  return errorService.isErrorBarNotPresent(browser);
}

function cleanList(browser) {
  var expectPath = '#delete-workspace-0';
  browser.waitForElementVisible('#workspaces-header');
  browser.pause(500);
  browser.elements('css selector', expectPath, (result) => {
    if (result.value.length !== 0) {
      console.log('! Workspace list is not empty. Deleting a workspace.');
      browser.click(expectPath + ' > span > button');
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
  browser.elements('css selector', expectPath, (result) => {
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

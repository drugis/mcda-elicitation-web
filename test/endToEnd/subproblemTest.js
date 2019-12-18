'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const subproblem1 = {
  title: 'subproblem1'
};

function setupSubProblem(browser) {
  browser.waitForElementVisible('#workspace-title');
  util.delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
    .waitForElementVisible('#effects-table-header')
    .click('#create-subproblem-button')
    .waitForElementVisible('#create-subproblem-header')
    .waitForElementVisible('#create-new-subproblem-button:disabled')
    .assert.containsText('#no-title-warning', 'No title entered')
    .assert.containsText('#missing-values-warning', 'Effects table may not contain missing values')
    .assert.containsText('#multiple-data-sources-warning', 'Effects table may not contain multiple data sources per criterion')
    .setValue('#subproblem-title', subproblem1.title)
    .click('#deselectionAlternativeId')
    .click('#deselectionDataSourceId')
    .click('#deselectionCriterionId')
    .waitForElementVisible('#create-new-subproblem-button:enabled');
  return browser;
}

module.exports = {
  beforeEach: function(browser) {
    loginService.login(browser);
    workspaceService.uploadTestWorkspace(browser, '/createSubproblemTestProblem.json');
  },

  afterEach: function(browser) {
    errorService.isErrorBarHidden(browser);
    util.delayedClick(browser, '#logo', '#workspaces-header');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser).end();
  },

  'Create subproblem': function(browser) {
    setupSubProblem(browser)
      .click('#create-new-subproblem-button');
  },

  'Re-enabling datasources, and criteria during subproblem creation': function(browser) {
    setupSubProblem(browser)
      .click('#deselectionDataSourceId')
      .waitForElementVisible('#create-new-subproblem-button:disabled')
      .click('#deselectionDataSourceId')
      .waitForElementVisible('#create-new-subproblem-button:enabled')

      .click('#deselectionCriterionId')
      .waitForElementVisible('#create-new-subproblem-button:disabled')
      .click('#deselectionCriterionId')
      .waitForElementVisible('#create-new-subproblem-button:enabled');
    browser.click('#create-new-subproblem-button');
  },

  'Switching between subproblems': function(browser) {
    setupSubProblem(browser)
      .waitForElementVisible('#create-new-subproblem-button:enabled')
      .click('#create-new-subproblem-button')
      .assert.containsText('#subproblem-selector', subproblem1.title)
      .click('#subproblem-selector')
      .click('option[label="Default"]')
      .assert.containsText('#subproblem-selector', 'Default');
  },

  'Edit the title': function(browser) {
    const newTitle = 'not default';
    browser.waitForElementVisible('#workspace-title');
    util.delayedClick(browser, '#problem-definition-tab', '#effects-table-header')
      .waitForElementVisible('#effects-table-header')
      .click('#edit-subproblem-button')
      .clearValue('#subproblem-title-input')
      .waitForElementVisible('#save-subproblem-button:disabled')
      .setValue('#subproblem-title-input', newTitle)
      .click('#save-subproblem-button')
      .waitForElementVisible('#effects-table-header')
      .assert.containsText('#subproblem-selector', newTitle);
  },

  'Reset during subproblem creation': function(browser) {
    setupSubProblem(browser)
      .waitForElementVisible('#create-new-subproblem-button:enabled')
      .click('#reset-subproblem-button')
      .waitForElementVisible('#create-new-subproblem-button:disabled')
      .assert.containsText('#subproblem-title', '')
      .waitForElementVisible('#deselectionAlternativeId:checked')
      .waitForElementVisible('#deselectionDataSourceId:checked')
      .waitForElementVisible('#deselectionCriterionId:checked')
      .click('#close-modal-button');
  },

  'Interact with scale sliders': function(browser) {
    const lowerValueLabel = '//*[@id="slider-0"]/div/span[10]';
    const upperValueLabel = '//*[@id="slider-0"]/div/span[11]';
    const moveFloor = '//*[@id="slider-0-floor"]';
    const moveCeil = '//*[@id="slider-0-ceil"]';
    const floorLabel = '//*[@id="slider-0"]/div/span[8]';
    const ceilLabel = '//*[@id="slider-0"]/div/span[9]';
    const moveLowerValue = '//*[@id="slider-0"]/div/span[6]';
    const moveUpperValue = '//*[@id="slider-0"]/div/span[7]';

    setupSubProblem(browser)
      .useXpath()
      .assert.containsText(lowerValueLabel, '-200')
      .assert.containsText(upperValueLabel, '200')
      .click(moveFloor)
      .click(moveCeil)
      .assert.containsText(floorLabel, '-300')
      .assert.containsText(ceilLabel, '300')
      .moveToElement(moveLowerValue, 0, 0)
      .mouseButtonDown(0)
      .moveToElement(moveFloor, 0, 0)
      .mouseButtonUp(0)
      .assert.containsText(lowerValueLabel, '-300')
      .moveToElement(moveUpperValue, 0, 0)
      .mouseButtonDown(0)
      .moveToElement(moveCeil, 0, 0)
      .mouseButtonUp(0)
      .assert.containsText(upperValueLabel, '300')
      .useCss()
      .click('#close-modal-button');
  }
};

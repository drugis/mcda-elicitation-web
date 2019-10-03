'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = 'http://localhost:3002';

module.exports = {
  'Create subproblem': function(browser) {
    const title = 'Test workspace';
    const workspacePath = '/createSubproblem.json';
    const subproblem1 = {
      title: 'subproblem1'
    };

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.uploadTestWorkspace(browser, workspacePath);

    browser
      .waitForElementVisible('#workspace-title')
      .click('#problem-definition-tab')
      .waitForElementVisible('#effects-table-header')
      .click('#create-subproblem-button')
      .waitForElementVisible('#create-subproblem-header')
      .assert.containsText('#no-title-warning', 'No title entered')
      .assert.containsText('#missing-values-warning', 'Effects table may not contain missing values')
      .assert.containsText('#multiple-data-sources-warning', 'Effects table may not contain multiple data sources per criterion')
      .setValue('#subproblem-title', subproblem1.title)
      .click('#deselectionAlternativeId')
      .click('#deselectionDataSourceId')
      .click('#deselectionCriterionId')
      .click('#finish-subproblem-creation-button');

    errorService.isErrorBarVisible(browser);
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },
};
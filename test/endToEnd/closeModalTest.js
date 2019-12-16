'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
const preferenceTabPath = '#preferences-tab';
const rankingCellPath = '#ranking-criterion-0';
const closeModalButtonPath = '#close-modal-button';
const cancelStep1Path = '#cancel-step1-button';

function cancelAction(browser, paths, expectedValue) {
  util.delayedClick(browser, paths.tab, paths.actionButton);
  browser
    .click(paths.actionButton)
    .click(paths.cancelButton)
    .assert.containsText(paths.content, expectedValue);
}

function clearValueCancelAction(browser, paths, expectedValue) {
  browser
    .click(paths.actionButton)
    .clearValue(paths.valueToClear)
    .click(paths.cancelButton)
    .assert.containsText(paths.content, expectedValue);
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser);
    workspaceService.addExample(browser, title);
    browser
      .click('#workspace-0')
      .waitForElementVisible('#workspace-title');
  },

  afterEach: function(browser) {
    util.delayedClick(browser, '#logo', '#workspaces-header');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Cancel editing workspace title': function(browser) {
    browser
      .click('#edit-workspace-title-button')
      .click('#cancel-workspace-title-button')
      .waitForElementVisible('#workspace-title');
  },

  'Cancel editing the therapeutic context': function(browser) {
    var paths = {
      valueToClear: '#therapeutic-context-input',
      actionButton: '#edit-therapeutic-context-button',
      cancelButton: closeModalButtonPath,
      content: '#therapeutic-context'
    };
    clearValueCancelAction(browser, paths, 'SMAA');
  },

  'Cancel editing a criterion': function(browser) {
    var paths = {
      valueToClear: '#criterion-title-input',
      actionButton: '#edit-criterion-0',
      cancelButton: closeModalButtonPath,
      content: '#criterion-title-0'
    };
    clearValueCancelAction(browser, paths, 'Treatment responders');
  },

  'Cancel editing a data source': function(browser) {
    var paths = {
      valueToClear: '#reference-input',
      actionButton: '#edit-data-source-0-0',
      cancelButton: closeModalButtonPath,
      content: '#data-source-reference-0-0'
    };
    clearValueCancelAction(browser, paths, 'Nemeroff and Thase (2007)');
  },

  'Cancel editing an alternative': function(browser) {
    var paths = {
      valueToClear: '#alternative-title',
      actionButton: '#edit-alternative-0',
      cancelButton: closeModalButtonPath,
      content: '#alternative-title-0'
    };
    clearValueCancelAction(browser, paths, 'Placebo');
  },

  'Cancel settings': function(browser) {
    var actionButtonPath = '#settings-button';
    var contentPath = '#c-0-ds-0-a-0-table-cell';
    browser
      .click(actionButtonPath)
      .click('#show-decimals-radio')
      .click('#smaa-radio')
      .click(closeModalButtonPath)
      .assert.containsText(contentPath, '37 / 101');
  },

  'Cancel editing a subproblem title': function(browser) {
    var actionButtonPath = '#edit-subproblem-button';
    var contentPath = '#subproblem-selector';
    util.delayedClick(browser, '#problem-definition-tab', actionButtonPath);
    browser
      .click(actionButtonPath)
      .clearValue('#subproblem-title-input')
      .click(closeModalButtonPath)
      .assert.containsText(contentPath, 'Default');
  },

  'Cancel creating a new subproblem': function(browser) {
    var paths = {
      tab: '#problem-definition-tab',
      actionButton: '#create-subproblem-button',
      cancelButton: closeModalButtonPath,
      content: '#subproblem-selector'
    };
    cancelAction(browser, paths, 'Default');
  },

  'Cancel setting a partial value function': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '#criterion-0-pvf-button',
      cancelButton: '#cancel-button',
      content: '#partial-value-functions-header'
    };
    cancelAction(browser, paths, 'Partial Value Functions');
  },

  'Cancel setting weights via ranking': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '#ranking-button',
      cancelButton: '#cancel-button',
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel setting weights via matching': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '#matching-button',
      cancelButton: cancelStep1Path,
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel precise swing weighting': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '#precise-swing-button',
      cancelButton: cancelStep1Path,
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel imprecise swing weighting': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '#imprecise-swing-button',
      cancelButton: cancelStep1Path,
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel editing a scenario': function(browser) {
    var actionButtonPath = '#edit-scenario-button';
    var cancelButtonPath = closeModalButtonPath;
    var contentPath = '#scenario-selector';
    util.delayedClick(browser, '#preferences-tab', actionButtonPath);
    browser
      .click(actionButtonPath)
      .clearValue('#new-scenario-title')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Default');
  },

  'Cancel creating a new scenario': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '#create-scenario-button',
      cancelButton: closeModalButtonPath,
      content: '#scenario-selector'
    };
    cancelAction(browser, paths, 'Default');
  },

  'Cancel copying a scenario': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '#copy-scenario-button',
      cancelButton: closeModalButtonPath,
      content: '#scenario-selector'
    };
    cancelAction(browser, paths, 'Default');
  },

  'Cancel editing graph labels': function(browser) {
    var paths = {
      valueToClear: '#label-input-0',
      tab: '#deterministic-tab',
      actionButton: '//*[@id="value-profile-container"]/div[2]/button',
      cancelButton: closeModalButtonPath,
      content: '#value-plot > svg:nth-child(1) > g:nth-child(2) > g:nth-child(6) > g:nth-child(2) > text:nth-child(2) > tspan:nth-child(1)'
    };
    util.delayedClick(browser, paths.tab, paths.actionButton, util.xpathSelectorType);
    browser
      .useXpath()
      .click(paths.actionButton)
      .useCss()
      .clearValue(paths.valueToClear)
      .click(paths.cancelButton)
      .assert.containsText(paths.content, 'Placebo');
  }
};

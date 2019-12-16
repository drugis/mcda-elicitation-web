'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');
const util = require('./util/util');

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
const preferenceTabPath = '//*[@id="preferences-tab"]';
const rankingCellPath = '//*[@id="de14e778-f723-48d4-8f4e-1e589714f4f2-ranking"]';
const closeModalButtonPath = '//*[@id="close-modal-button"]';
const cancelStep1Path = '//*[@id="cancel-step1-button"]';

function cancelAction(browser, paths, expectedValue) {
  util.delayedClick(browser, paths.tab, paths.actionButton, util.xpathSelectorType);
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
      .waitForElementVisible('#workspace-title')
      .useXpath();
  },

  afterEach: function(browser) {
    browser.useCss();
    util.delayedClick(browser, '#logo', '#workspaces-header');
    workspaceService.deleteFromList(browser, 0);
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Cancel editing workspace title': function(browser) {
    browser
      .click('//*[@id="edit-workspace-title-button"]')
      .click('//*[@id="cancel-workspace-title-button"]')
      .waitForElementVisible('//*[@id="workspace-title"]');
  },

  'Cancel editing the therapeutic context': function(browser) {
    var paths = {
      valueToClear: '//*[@id="therapeutic-context-input"]',
      actionButton: '//*[@id="edit-therapeutic-context-button"]',
      cancelButton: closeModalButtonPath,
      content: '//*[@id="therapeutic-context"]'
    };
    clearValueCancelAction(browser, paths, 'SMAA');
  },

  'Cancel editing a criterion': function(browser) {
    var paths = {
      valueToClear: '//*[@id="criterion-title-input"]',
      actionButton: '//*[@id="edit-criterion-0"]',
      cancelButton: closeModalButtonPath,
      content: '//*[@id="criterion-title-0"]'
    };
    clearValueCancelAction(browser, paths, 'Treatment responders');
  },

  'Cancel editing a data source': function(browser) {
    var paths = {
      valueToClear: '//*[@id="reference-input"]',
      actionButton: '//*[@id="edit-data-source-0-0"]',
      cancelButton: closeModalButtonPath,
      content: '//*[@id="data-source-reference-0-0"]'
    };
    clearValueCancelAction(browser, paths, 'Nemeroff and Thase (2007)');
  },

  'Cancel editing an alternative': function(browser) {
    var paths = {
      valueToClear: '//*[@id="alternative-title"]',
      actionButton: '//*[@id="edit-alternative-0"]',
      cancelButton: closeModalButtonPath,
      content: '//*[@id="alternative-title-0"]'
    };
    clearValueCancelAction(browser, paths, 'Placebo');
  },

  'Cancel settings': function(browser) {
    var actionButtonPath = '//*[@id="settings-button"]';
    var contentPath = '//*[@id="criterion-0-alternative-0-effects-table-cell"]';
    browser
      .click(actionButtonPath)
      .click('//*[@id="show-decimals-radio"]')
      .click('//*[@id="smaa-radio"]')
      .click(closeModalButtonPath)
      .assert.containsText(contentPath, '37 / 101');
  },

  'Cancel editing a subproblem title': function(browser) {
    var actionButtonPath = '//*[@id="edit-subproblem-button"]';
    var contentPath = '//*[@id="subproblem-selector"]';
    util.delayedClick(browser, '//*[@id="problem-definition-tab"]', actionButtonPath, util.xpathSelectorType);
    browser
      .click(actionButtonPath)
      .clearValue('//*[@id="subproblem-title-input"]')
      .click(closeModalButtonPath)
      .assert.containsText(contentPath, 'Default');
  },

  'Cancel creating a new subproblem': function(browser) {
    var paths = {
      tab: '//*[@id="problem-definition-tab"]',
      actionButton: '//*[@id="create-subproblem-button"]',
      cancelButton: closeModalButtonPath,
      content: '//*[@id="subproblem-selector"]'
    };
    cancelAction(browser, paths, 'Default');
  },

  'Cancel setting a partial value function': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '//*[@id="criterion-0-pvf-button"]',
      cancelButton: '//*[@id="cancel-button"]',
      content: '//*[@id="partial-value-functions-header"]'
    };
    cancelAction(browser, paths, 'Partial Value Functions');
  },

  'Cancel setting weights via ranking': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '//*[@id="ranking-button"]',
      cancelButton: '//*[@id="cancel-button"]',
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel setting weights via matching': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '//*[@id="matching-button"]',
      cancelButton: cancelStep1Path,
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel precise swing weighting': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '//*[@id="precise-swing-button"]',
      cancelButton: cancelStep1Path,
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel imprecise swing weighting': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '//*[@id="imprecise-swing-button"]',
      cancelButton: cancelStep1Path,
      content: rankingCellPath
    };
    cancelAction(browser, paths, '?');
  },

  'Cancel editing a scenario': function(browser) {
    var actionButtonPath = '//*[@id="edit-scenario-button"]';
    var cancelButtonPath = closeModalButtonPath;
    var contentPath = '//*[@id="scenario-selector"]';
    util.delayedClick(browser, '//*[@id="preferences-tab"]', actionButtonPath, util.xpathSelectorType);
    browser
      .click(actionButtonPath)
      .clearValue('//*[@id="new-scenario-title"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Default');
  },

  'Cancel creating a new scenario': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '//*[@id="create-scenario-button"]',
      cancelButton: closeModalButtonPath,
      content: '//*[@id="scenario-selector"]'
    };
    cancelAction(browser, paths, 'Default');
  },

  'Cancel copying a scenario': function(browser) {
    var paths = {
      tab: preferenceTabPath,
      actionButton: '//*[@id="copy-scenario-button"]',
      cancelButton: closeModalButtonPath,
      content: '//*[@id="scenario-selector"]'
    };
    cancelAction(browser, paths, 'Default');
  },

  'Cancel editing graph labels': function(browser) {
    var paths = {
      valueToClear: '//*[@id="label-input-0"]',
      tab: '//*[@id="deterministic-tab"]',
      actionButton: '//*[@id="value-profile-container"]/div[2]/button',
      cancelButton: closeModalButtonPath,
      content: '#value-plot > svg:nth-child(1) > g:nth-child(2) > g:nth-child(6) > g:nth-child(2) > text:nth-child(2) > tspan:nth-child(1)'
    };
    util.delayedClick(browser, paths.tab, paths.actionButton, util.xpathSelectorType);
    browser
      .click(paths.actionButton)
      .clearValue(paths.valueToClear)
      .click(paths.cancelButton)
      .useCss()
      .assert.containsText(paths.content, 'Placebo');
  }
};

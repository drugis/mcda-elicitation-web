'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');

const testUrl = 'http://localhost:3002';

const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    browser
      .click('a[id="' + title + '"]')
      .waitForElementVisible('#workspace-title')
      .useXpath()
      ;
  },

  afterEach: function(browser) {
    browser.useCss().click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end()
      ;
  },

  'Cancel editing workspace title': function(browser) {
    browser
      .click('//*[@id="edit-workspace-title-button"]')
      .click('//*[@id="cancel-workspace-title-button"]')
      .waitForElementVisible('//*[@id="workspace-title"]')
      ;
  },

  'Cancel editing the therapeutic context': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[2]/h4/a/i';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/div/button';
    var contentPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[3]/span';
    browser
      .click(actionButtonPath)
      .clearValue('//*[@id="therapeutic-context-input"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'SMAA')
      ;
  },

  'Cancel editing a criterion': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[5]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[2]/div/a/i';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/div/div/button';
    var contentPath = '//*[@id="criterion-title-de14e778-f723-48d4-8f4e-1e589714f4f2"]';
    browser
      .click(actionButtonPath)
      .clearValue('//*[@id="criterion-title-input"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Treatment responders')
      ;
  },

  'Cancel editing a data source': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[5]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[8]/a/i';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/button';
    var contentPath = '//*[@id="data-source-reference-de14e778-f723-48d4-8f4e-1e589714f4f2-029909c4-cb8c-43cb-9816-e8550ef561be"]';
    browser
      .click(actionButtonPath)
      .clearValue('//*[@id="reference-input"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Nemeroff and Thase (2007)')
      ;
  },

  'Cancel editing an alternative': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[7]/table/tbody/tr[1]/td[3]/a/i';
    var cancelButtonPath = '//*[@id="close-modal-button"]';
    var contentPath = '//*[@id="alternative-title-38deaf60-9014-4af9-997e-e5f08bc8c8ff"]';
    browser
      .click(actionButtonPath)
      .clearValue('//*[@id="alternative-title"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Placebo')
      ;
  },

  'Cancel settings': function(browser) {
    var actionButtonPath = '//*[@id="settings-button"]';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/div/div/button';
    var contentPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[5]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[3]/div/effects-table-cell/div';
    browser
      .click(actionButtonPath)
      .click('//*[@id="show-decimals-radio"]')
      .click('//*[@id="deterministic-analysis-radio"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, '37 / 101')
      ;
  },

  'Cancel editing a subproblem': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[2]/div/div/div[1]/div/a[1]/i';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/div/button';
    var contentPath = '//*[@id="subproblem-selector"]';
    browser
      .click('//*[@id="problem-definition-tab"]')
      .click(actionButtonPath)
      .clearValue('//*[@id="subproblem-title-input"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Default')
      ;
  },

  'Cancel creating a new subproblem': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[2]/div/div/div[1]/div/a[2]/i';
    var cancelButtonPath = '//*[@id="close-button"]';
    var contentPath = '//*[@id="subproblem-selector"]';
    browser
      .click('//*[@id="problem-definition-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Default')
      ;
  },

  'Cancel setting a partial value function': function(browser) {
    var actionButtonPath = '//*[@id="de14e778-f723-48d4-8f4e-1e589714f4f2-pvf-button"]';
    var cancelButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div/div[2]/div/button[1]';
    var contentPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div[2]/h4';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Partial Value Functions')
      ;
  },

  'Cancel setting weights via ranking': function(browser) {
    var actionButtonPath = '//*[@id="ranking-button"]';
    var cancelButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div[2]/div/button[1]';
    var contentPath = '//*[@id="de14e778-f723-48d4-8f4e-1e589714f4f2-ranking"]';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, '?')
      ;
  },

  'Cancel setting weights via matching': function(browser) {
    var actionButtonPath = '//*[@id="matching-button"]';
    var cancelButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div/div[2]/div[1]/button[1]';
    var contentPath = '//*[@id="de14e778-f723-48d4-8f4e-1e589714f4f2-ranking"]';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, '?')
      ;
  },

  'Cancel precise swing weighting': function(browser) {
    var actionButtonPath = '//*[@id="precise-swing-button"]';
    var cancelButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div/div[2]/div[1]/button[1]';
    var contentPath = '//*[@id="de14e778-f723-48d4-8f4e-1e589714f4f2-ranking"]';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, '?')
      ;
  },

  'Cancel imprecise swing weighting': function(browser) {
    var actionButtonPath = '//*[@id="imprecise-swing-button"]';
    var cancelButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div/div[2]/div[1]/button[1]';
    var contentPath = '//*[@id="de14e778-f723-48d4-8f4e-1e589714f4f2-ranking"]';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, '?')
      ;
  },

  'Cancel editing a scenario': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div[1]/div/a[1]/i';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/div/button';
    var contentPath = '//*[@id="scenario-selector"]';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .clearValue('//*[@id="new-scenario-title"]')
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Default')
      ;
  },

  'Cancel creating a new scenario': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div[1]/div/a[2]/i';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/div/button';
    var contentPath = '//*[@id="scenario-selector"]';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Default')
      ;
  },

  'Cancel copying a scenario': function(browser) {
    var actionButtonPath = '/html/body/div[2]/div/div[3]/div/div/div/div/div[3]/div/div/div[1]/div/a[3]/i';
    var cancelButtonPath = '/html/body/div[4]/div/div/form/div/button';
    var contentPath = '//*[@id="scenario-selector"]';
    browser
      .click('//*[@id="preferences-tab"]')
      .click(actionButtonPath)
      .click(cancelButtonPath)
      .assert.containsText(contentPath, 'Default')
      ;
  }
};

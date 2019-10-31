'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');
const errorService = require('./util/errorService');

const testUrl = require('./util/constants').testUrl;

const title = 'manual input';
const therapeuticContext = 'end-to-end test';

const criterion1 = manualInputService.createCriterion('c1', 'favorable');
const criterion2 = manualInputService.createCriterion('c2', 'unfavorable');
const criterion3 = manualInputService.createCriterion('c3', 'favorable');

const dataSource1 = manualInputService.createDataSource('ref1');
const dataSource2 = manualInputService.createDataSource('ref2');
const dataSource3 = manualInputService.createDataSource('ref3');

const alternative1 = manualInputService.createAlternative('a1');
const alternative2 = manualInputService.createAlternative('a2');

const criterion1TitlePath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[1]/h5';
const criterion1AddDataSourcePath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/button';
const criterion1EditPath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[2]/div/a[1]';
const criterion1NewTitlePath = '//div[9]/criterion-list/div[2]/div[2]/criterion-card/div/div[2]/div/div[1]/h5';
const criterion1NewDescriptionPath = '//div[9]/criterion-list/div[2]/div[2]/criterion-card/div/div[2]/div/div[3]';
const criterion1DataSource1Path = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[6]/table/tbody/tr/td[2]';
const criterion1DeletePath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[2]/div/a[2]';

const criterion2AddDataSourcePath = '//div[9]/criterion-list/div[2]/div[2]/criterion-card/div/div[2]/div/div[5]/button';

const dataSource1ReferencePath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[6]/table/tbody/tr/td[2]/div';
const dataSource1EditPath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[6]/table/tbody/tr/td[3]/a';
const dataSource1DeletePath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[6]/table/tbody/tr/td[4]/a';

const alternative1TitlePath = '//div[12]/table/tbody/tr[1]/td[2]';
const alternative1EditPath = '//div[12]/table/tbody/tr[1]/td[3]/a';
const alternative1DeletePath = '//div[12]/table/tbody/tr[1]/td[4]/a';

const moveCriterionUpPath = '//criterion-list/div[1]/div[3]/criterion-card/div/div[1]/div/div[1]/a/i';
const moveCriterionDownPath = '//criterion-list/div[1]/div[2]/criterion-card/div/div[1]/div/div[2]/a/i';
const moveDataSourceUpPath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[6]/table/tbody/tr[2]/td[1]/div[1]/a';
const moveDataSourceDownPath = '//div[9]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[6]/table/tbody/tr[1]/td[1]/div[2]/a';
const moveAlternativeUpPath = '//div[12]/table/tbody/tr[2]/td[1]/div[1]/a';
const moveAlternativeDownPath = '//div[12]/table/tbody/tr[1]/td[1]/div[2]/a';
function createInputDefault(browser) {
  browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#manual-workspace-radio')
    .click('#add-workspace-button')
    .waitForElementVisible('#manual-input-header-step1')
    .setValue('#workspace-title', title)
    .setValue('#therapeutic-context', therapeuticContext)
    .click('#favorability-checkbox');

  manualInputService.addCriterion(browser, criterion1);
  manualInputService.addCriterion(browser, criterion2);
  manualInputService.addDataSource(browser, criterion1AddDataSourcePath, dataSource1);
  manualInputService.addDataSource(browser, criterion2AddDataSourcePath, dataSource2);
  manualInputService.addAlternative(browser, alternative1);
  manualInputService.addAlternative(browser, alternative2);
}

function clickElement(browser, rowNumber, columnNumber, element) {
  const elementId = util.getOnlyProperty(element.value);
  const value = rowNumber + columnNumber;
  browser
    .elementIdClick(elementId)
    .useXpath()
    .setValue('//tr[' + rowNumber + ']/td[' + columnNumber + ']//input', value)
    .useCss()
    .click('#deterministic-tab');
}

function setValuesForRow(browser, rowNumber) {
  setValues(browser, rowNumber, 6);
  setValues(browser, rowNumber, 7);
}

function setValues(browser, rowNumber, columnNumber) {
  const path = '//tr[' + rowNumber + ']' + '/td[' + columnNumber + ']//a';
  browser.element('xpath', path, _.partial(clickElement, browser, rowNumber, columnNumber));
}

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
  },

  afterEach: function(browser) {
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Manual input of a workspace': function(browser) {
    createInputDefault(browser);

    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2');

    setValuesForRow(browser, 1);
    setValuesForRow(browser, 2);

    browser
      .click('#done-button')
      .waitForElementVisible('#workspace-title');

    errorService.isErrorBarHidden(browser);

    browser
      .assert.containsText('#workspace-title', title)
      .assert.containsText('#therapeutic-context', therapeuticContext)
      .useXpath()
      .assert.containsText('//div[5]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[1]/h5', criterion1.title)
      .assert.containsText('//div[5]/criterion-list/div[2]/div[2]/criterion-card/div/div[2]/div/div[1]/h5', criterion2.title)
      .assert.containsText('//div[5]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[3]', criterion1.description)
      .assert.containsText('//div[5]/criterion-list/div[2]/div[2]/criterion-card/div/div[2]/div/div[3]', criterion2.description)
      .assert.containsText('//div[5]/criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[6]/div', dataSource1.reference)
      .assert.containsText('//div[5]/criterion-list/div[2]/div[2]/criterion-card/div/div[2]/div/div[5]/table/tbody/tr/td[6]/div', dataSource2.reference)
      .assert.containsText('//div[7]/table/tbody/tr[1]/td[2]', alternative1.title)
      .assert.containsText('//div[7]/table/tbody/tr[2]/td[2]', alternative2.title)
      .assert.containsText('//criterion-list/div[1]//td[3]//*', 7)
      .assert.containsText('//criterion-list/div[1]//td[4]//*', 8)
      .assert.containsText('//criterion-list/div[2]//td[3]//*', 8)
      .assert.containsText('//criterion-list/div[2]//td[4]//*', 9)
      .useCss()
      .click('#logo')
      .waitForElementVisible('#create-workspace-button');

    errorService.isErrorBarHidden(browser);
    workspaceService.deleteFromList(browser, title);
  },

  'Editing a criterion': function(browser) {
    const newTitle = 'newTitle';
    const newDescription = 'newDescription';

    createInputDefault(browser);
    browser
      .useXpath()
      .click(criterion1EditPath)
      .useCss()
      .clearValue('#criterion-title-input')
      .setValue('#criterion-title-input', newTitle)
      .clearValue('#criterion-description-input')
      .setValue('#criterion-description-input', newDescription)
      .click('#favorability-selector-unfavorable')
      .click('#add-criterion-confirm-button')
      .useXpath()
      .assert.containsText(criterion1NewTitlePath, newTitle)
      .assert.containsText(criterion1NewDescriptionPath, 'Description: ' + newDescription)
      .useCss();
  },

  'Editing a data source': function(browser) {
    const newReference = 'newReference';
    const newUrl = 'www.google.com';

    createInputDefault(browser);
    browser
      .useXpath()
      .click(dataSource1EditPath)
      .useCss()
      .clearValue('#data-source-reference')
      .setValue('#data-source-reference', newReference)
      .clearValue('#data-source-url')
      .setValue('#data-source-url', newUrl)
      .click('#add-data-source-button')
      .useXpath()
      .assert.containsText(dataSource1ReferencePath, newReference)
      .useCss();
  },

  'Editing an alternative': function(browser) {
    const newTitle = 'newTitle';

    createInputDefault(browser);
    browser
      .useXpath()
      .click(alternative1EditPath)
      .useCss()
      .clearValue('#alternative-title')
      .setValue('#alternative-title', newTitle)
      .click('#save-alternative-button')
      .useXpath()
      .assert.containsText(alternative1TitlePath, newTitle)
      .useCss();
  },

  'Deleting a criterion': function(browser) {
    createInputDefault(browser);
    manualInputService.addCriterion(browser, criterion3);
    browser
      .useXpath()
      .click(criterion1DeletePath)
      .assert.containsText(criterion1TitlePath, criterion3.title)
      .useCss();
  },

  'Deleting a data source': function(browser) {
    createInputDefault(browser);
    browser
      .useXpath()
      .click(dataSource1DeletePath)
      .assert.containsText(criterion1DataSource1Path, 'No data sources defined')
      .useCss();
  },

  'Deleting an alternative': function(browser) {
    createInputDefault(browser);
    browser
      .useXpath()
      .click(alternative1DeletePath)
      .assert.containsText(alternative1TitlePath, alternative2.title)
      .useCss();
  },

  'Moving criterion up and down': function(browser) {
    createInputDefault(browser);
    manualInputService.addCriterion(browser, criterion3);

    browser
      .useXpath()
      .click(moveCriterionUpPath)
      .assert.containsText(criterion1TitlePath, criterion3.title)
      .click(moveCriterionDownPath)
      .assert.containsText(criterion1TitlePath, criterion1.title)
      .useCss();
  },

  'Moving data source up and down': function(browser) {
    browser
      .waitForElementVisible('#create-workspace-button')
      .click('#create-workspace-button')
      .click('#manual-workspace-radio')
      .click('#add-workspace-button')
      .waitForElementVisible('#manual-input-header-step1')
      .setValue('#workspace-title', title)
      .setValue('#therapeutic-context', therapeuticContext)
      .click('#favorability-checkbox');

    manualInputService.addCriterion(browser, criterion1);

    manualInputService.addDataSource(browser, criterion1AddDataSourcePath, dataSource1);
    manualInputService.addDataSource(browser, criterion1AddDataSourcePath, dataSource3);

    browser
      .useXpath()
      .click(moveDataSourceUpPath)
      .assert.containsText(dataSource1ReferencePath, dataSource3.reference)
      .click(moveDataSourceDownPath)
      .assert.containsText(dataSource1ReferencePath, dataSource1.reference)
      .useCss();
  },

  'Moving an alternative up and down': function(browser) {
    createInputDefault(browser);

    browser
      .useXpath()
      .click(moveAlternativeUpPath)
      .assert.containsText(alternative1TitlePath, alternative2.title)
      .click(moveAlternativeDownPath)
      .assert.containsText(alternative1TitlePath, alternative1.title)
      .useCss();
  },

  'Navigating from manual input step2 to step1': function(browser) {
    createInputDefault(browser);

    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2')
      .click('#go-to-step1-button')
      .waitForElementVisible('#manual-input-header-step1');
  },

  'Saving during step 1': function(browser) {
    createInputDefault(browser);

    browser
      .click('#step1-save-button')
      .refresh()
      .waitForElementVisible('#manual-input-header-step1')
      .useXpath()
      .assert.containsText(criterion1TitlePath, criterion1.title)
      .useCss();

    browser.click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, title);
  },

  'Saving during step 2': function(browser) {
    createInputDefault(browser);

    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2')
      .click('#step2-save-button')
      .refresh()
      .waitForElementVisible('#manual-input-header-step2');

    browser.click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, title);
  },

  'Delete a saved workspace': function(browser) {
    createInputDefault(browser);
    browser.click('#step1-save-button');
    browser.click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, title);
  },

  'Continuing working on a saved workspace': function(browser) {
    createInputDefault(browser);
    browser.click('#step1-save-button')
      .click('#logo')
      .waitForElementVisible('a[id="in-progress-workspace-title-' + title + '"]')
      .click('a[id="in-progress-workspace-title-' + title + '"]')
      .waitForElementVisible('#manual-input-header-step1')
      .useXpath()
      .assert.containsText(criterion1TitlePath, criterion1.title)
      .useCss();

    browser.click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, title);
  },

  'Changing unit of measurement': function(browser) {
    const firstCell = '/html/body/div[1]/div/div/div[5]/div/div/div[1]/div/manual-input-table/table/tbody/tr[1]/td[6]/effect-input-helper/dropdown-toggle/span/toggle/a';
    const unitLabel = 'UoM label';

    createInputDefault(browser);
    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2');

    setValuesForRow(browser, 1);
    setValuesForRow(browser, 2);
    browser
      .useXpath()
      .assert.containsText(firstCell, 7)
      .useCss()
      .click('#edit-unit-of-measurement-' + criterion1.title + '-' + dataSource1.reference)
      .setValue('#uom-label', unitLabel)
      .click('#uom-save-button')
      .assert.containsText('#unit-of-measurement-label-' + criterion1.title + '-' + dataSource1.reference, unitLabel)

      .click('#edit-unit-of-measurement-' + criterion1.title + '-' + dataSource1.reference)
      .click('#unit-of-measurement-selector')
      .click('option[label="Proportion (decimal)"]')
      .click('#uom-save-button')
      .assert.containsText('#unit-of-measurement-label-' + criterion1.title + '-' + dataSource1.reference, 'Proportion')
      .useXpath()
      .assert.containsText(firstCell, 'Missing or invalid input')
      .useCss();
  },

  'Setting the strength of evidence and uncertainties': function(browser) {
    const strength = 'very stong';
    const uncertainties = 'but also very uncertain';

    createInputDefault(browser);
    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2')
      .click('#edit-soe-unc-c1-ref1')
      .waitForElementVisible('#strength-of-evidence-input')
      .setValue('#strength-of-evidence-input', strength)
      .setValue('#uncertainties-input', uncertainties)
      .click('#save-soe-unc-button')
      .assert.containsText('#strength-of-evidence-c1-ref1', 'SoE: ' + strength)
      .assert.containsText('#uncertainties-c1-ref1', 'Unc: ' + uncertainties);
  }
};

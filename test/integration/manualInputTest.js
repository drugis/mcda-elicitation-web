'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');
const errorService = require('./util/errorService.js');

const testUrl = 'http://localhost:3002';

const title = 'manual input';
const therapeuticContext = 'end-to-end test';

const criterion1 = createCriterion('c1', 'favorable');
const criterion2 = createCriterion('c2', 'unfavorable');
const criterion3 = createCriterion('c3', 'favorable');

const dataSource1 = createDataSource('ref1');
const dataSource2 = createDataSource('ref2');
const dataSource3 = createDataSource('ref3');

const alternative1 = createAlternative('a1');
const alternative2 = createAlternative('a2');

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

function createCriterion(title, favorability) {
  return {
    title: title,
    description: 'description',
    favorability: favorability
  };
}

function createDataSource(reference) {
  return {
    reference: reference,
    url: 'http://url.com'
  };
}

function createAlternative(title) {
  return { title: title };
}

function createInputDefault(browser) {
  loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);

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
    .click('#deterministic-tab')
    ;
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
      .waitForElementVisible('#create-workspace-button')
      ;

    errorService.isErrorBarHidden(browser);
    workspaceService.deleteFromList(browser, title);
    browser.end();
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
      .useCss()
      ;

    browser.end();
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
      .useCss()
      ;
    browser.end();
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
      .useCss()
      ;
    browser.end();
  },

  'Deleting a criterion': function(browser) {
    createInputDefault(browser);
    manualInputService.addCriterion(browser, criterion3);
    browser
      .useXpath()
      .click(criterion1DeletePath)
      .assert.containsText(criterion1TitlePath, criterion3.title)
      .useCss()
      ;
    browser.end();
  },

  'Deleting a data source': function(browser) {
    createInputDefault(browser);
    browser
      .useXpath()
      .click(dataSource1DeletePath)
      .assert.containsText(criterion1DataSource1Path, 'No data sources defined')
      .useCss()
      ;
    browser.end();
  },

  'Deleting an alternative': function(browser) {
    createInputDefault(browser);
    browser
      .useXpath()
      .click(alternative1DeletePath)
      .assert.containsText(alternative1TitlePath, alternative2.title)
      .useCss()
      ;
    browser.end();
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
      .useCss()
      ;
    browser.end();
  },

  'Moving data source up and down': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);

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
      .useCss()
      ;
    browser.end();
  },

  'Moving an alternative up and down': function(browser) {
    createInputDefault(browser);

    browser
      .useXpath()
      .click(moveAlternativeUpPath)
      .assert.containsText(alternative1TitlePath, alternative2.title)
      .click(moveAlternativeDownPath)
      .assert.containsText(alternative1TitlePath, alternative1.title)
      .useCss()
      ;
    browser.end();
  },

  'Navigating from manual input step2 to step1': function(browser) {
    createInputDefault(browser);

    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2')
      .click('#go-to-step1-button')
      .waitForElementVisible('#manual-input-header-step1')
      ;

    browser.end();
  }
};

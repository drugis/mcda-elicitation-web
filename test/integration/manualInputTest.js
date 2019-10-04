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

  manualInputService.addDataSource(browser, criterion1.title, dataSource1);
  manualInputService.addDataSource(browser, criterion2.title, dataSource2);

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
      .assert.containsText('#criterion-title-c1', criterion1.title)
      .assert.containsText('#criterion-title-c2', criterion2.title)
      .assert.containsText('#criterion-description-c1', criterion1.description)
      .assert.containsText('#criterion-description-c2', criterion2.description)
      .assert.containsText('#data-source-reference-c1-ref1', dataSource1.reference)
      .assert.containsText('#data-source-reference-c2-ref2', dataSource2.reference)
      .assert.containsText('#alternative-title-a1', alternative1.title)
      .assert.containsText('#alternative-title-a2', alternative2.title)
      .useXpath()
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
    browser.waitForElementVisible('#empty-workspace-message');
    browser.end();
  },

  'Editing a criterion': function(browser) {
    const newTitle = 'newTitle';
    const newDescription = 'newDescription';
    createInputDefault(browser);
    browser
      .click('#edit-criterion-' + criterion1.title + '-button')
      .clearValue('#criterion-title')
      .setValue('#criterion-title', newTitle)
      .clearValue('#criterion-description')
      .setValue('#criterion-description', newDescription)
      .click('#favorability-selector-unfavorable')
      .click('#add-criterion-confirm-button')
      .assert.containsText('#criterion-title-' + newTitle, newTitle)
      .assert.containsText('#criterion-description-' + newTitle, 'Description: ' + newDescription)
      ;

    browser.end();
  },

  'Editing a data source': function(browser) {
    const newReference = 'newReference';
    const newUrl = 'www.google.com';
    createInputDefault(browser);
    browser
      .click('#edit-data-source-' + criterion1.title + '-' + dataSource1.reference)
      .clearValue('#data-source-reference')
      .setValue('#data-source-reference', newReference)
      .clearValue('#data-source-url')
      .setValue('#data-source-url', newUrl)
      .click('#add-data-source-button')
      .assert.containsText('#data-source-reference-' + criterion1.title + '-' + newReference, newReference)
      ;
    browser.end();
  },

  'Editing an alternative': function(browser) {
    const newTitle = 'newTitle';
    createInputDefault(browser);
    browser
      .click('#edit-alternative-' + alternative1.title)
      .clearValue('#alternative-title')
      .setValue('#alternative-title', newTitle)
      .click('#save-alternative-button')
      .assert.containsText('#alternative-title-' + newTitle, newTitle)
      ;
    browser.end();
  },

  'Deleting a criterion': function(browser) {
    createInputDefault(browser);
    browser.click('#delete-criterion-' + criterion1.title + '-button');
    util.isElementNotPresent(browser, '//*[@id="criterion-title-' + criterion1.title + '"]');
    browser.end();
  },

  'Deleting a data source': function(browser) {
    createInputDefault(browser);
    browser.click('#delete-data-source-' + criterion1.title + '-' + dataSource1.reference);
    util.isElementNotPresent(browser, '//*[@id="data-source-reference-' + criterion1.title + '-' + dataSource1.reference + '"]');
    browser.end();
  },

  'Deleting an alternative': function(browser) {
    createInputDefault(browser);
    browser.click('#delete-alternative-' + alternative1.title);
    util.isElementNotPresent(browser, '//*[@id="alternative-title-' + alternative1.title + '"]');
    browser.end();
  },

  'Moving criterion up and down': function(browser) {
    createInputDefault(browser);
    manualInputService.addCriterion(browser, criterion3);

    const moveCriterionUpPath = '//criterion-list/div[1]/div[3]/criterion-card/div/div[1]/div/div[1]/a/i';
    const moveCriterionDownPath = '//criterion-list/div[1]/div[2]/criterion-card/div/div[1]/div/div[2]/a/i';
    const firstCriterionTitlePath = '//criterion-list/div[1]/div[2]/criterion-card/div/div[2]/div/div[1]/h5';

    browser
      .useXpath()
      .click(moveCriterionUpPath)
      .assert.containsText(firstCriterionTitlePath, criterion3.title)
      .click(moveCriterionDownPath)
      .assert.containsText(firstCriterionTitlePath, criterion1.title)
      .useCss()
      ;
    browser.end();
  },

  'Moving data source up and down': function(browser) {
    createInputDefault(browser);
    manualInputService.addDataSource(browser, criterion1.title, dataSource3);

    const firstDataSourceTitlePath = '//criterion-list/div[1]/div[2]/criterion-card//div[6]/table/tbody/tr[1]/td[2]/div';

    browser
      .useXpath()
      .click('//*[@id="move-up-data-source-' + criterion1.title + '-' + dataSource3.reference + '"]')
      .assert.containsText(firstDataSourceTitlePath, dataSource3.reference)
      .click('//*[@id="move-down-data-source-' + criterion1.title + '-' + dataSource3.reference + '"]')
      .assert.containsText(firstDataSourceTitlePath, dataSource1.reference)
      .useCss()
      ;
    browser.end();
  },

  'Moving an alternative up and down': function(browser) {
    createInputDefault(browser);

    const firstAlternativeTitlePath = '/html/body/div[2]/div/div/div[12]/table/tbody/tr[1]/td[2]';

    browser
      .useXpath()
      .click('//*[@id="move-up-alternative-' + alternative2.title + '"]')
      .assert.containsText(firstAlternativeTitlePath, alternative2.title)
      .click('//*[@id="move-down-alternative-' + alternative2.title + '"]')
      .assert.containsText(firstAlternativeTitlePath, alternative1.title)
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

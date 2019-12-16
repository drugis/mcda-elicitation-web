'use strict';

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

module.exports = {
  beforeEach: function(browser) {
    browser.resizeWindow(1366, 728);
    loginService.login(browser);
  },

  afterEach: function(browser) {
    errorService.isErrorBarHidden(browser);
    browser.end();
  },

  'Manual input of a workspace': function(browser) {
    manualInputService.createInputDefault(browser);

    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2');

    manualInputService.setValuesForRow(browser, 1);
    manualInputService.setValuesForRow(browser, 2);

    browser
      .click('#done-button')
      .waitForElementVisible('#workspace-title');

    errorService.isErrorBarHidden(browser);

    browser
      .assert.containsText('#workspace-title', manualInputService.TITLE)
      .assert.containsText('#therapeutic-context', manualInputService.THERAPEUTIC_CONTEXT)
      .useXpath()
      .assert.containsText('//*[@id="criterion-title-0"]', manualInputService.CRITERION1.title)
      .assert.containsText('//*[@id="criterion-title-1"]', manualInputService.CRITERION2.title)
      .assert.containsText('//*[@id="criterion-description-0"]', manualInputService.CRITERION1.description)
      .assert.containsText('//*[@id="criterion-description-1"]', manualInputService.CRITERION2.description)
      .assert.containsText('//*[@id="linked-data-source-reference-0-0"]', manualInputService.DATA_SOURCE1.reference)
      .assert.containsText('//*[@id="linked-data-source-reference-1-0"]', manualInputService.DATA_SOURCE2.reference)
      .assert.containsText('//*[@id="alternative-title-0"]', manualInputService.ALTERNATIVE1.title)
      .assert.containsText('//*[@id="alternative-title-1"]', manualInputService.ALTERNATIVE2.title)
      .assert.containsText('//*[@id="c-0-ds-0-a-0-table-cell"]/effects-table-cell/div/div', 7)
      .assert.containsText('//*[@id="c-0-ds-0-a-1-table-cell"]/effects-table-cell/div/div', 8)
      .assert.containsText('//*[@id="c-1-ds-0-a-0-table-cell"]/effects-table-cell/div/div', 8)
      .assert.containsText('//*[@id="c-1-ds-0-a-1-table-cell"]/effects-table-cell/div/div', 9)
      .useCss()
      .click('#logo')
      .waitForElementVisible('#create-workspace-button');

    errorService.isErrorBarHidden(browser);
    workspaceService.deleteFromList(browser, 0);
  },

  'Navigating from manual input step2 to step1': function(browser) {
    manualInputService.createInputDefault(browser);

    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2')
      .click('#go-to-step1-button')
      .waitForElementVisible('#manual-input-header-step1');
  },

  'Saving during step 2': function(browser) {
    manualInputService.createInputDefault(browser);

    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2')
      .click('#step2-save-button')
      .refresh()
      .waitForElementVisible('#manual-input-header-step2');

    browser.click('#logo');
    workspaceService.deleteUnfinishedFromList(browser, 0);
  },

  'Changing unit of measurement': function(browser) {
    const firstCell = '#ds-0-a-0-input-cell';
    const unitLabel = 'UoM label';

    manualInputService.createInputDefault(browser);
    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2');

    manualInputService.setValuesForRow(browser, 1);
    manualInputService.setValuesForRow(browser, 2);
    browser
      .assert.containsText(firstCell, 7)
      .click('#unit-of-measurement-0-edit')
      .setValue('#uom-label', unitLabel)
      .click('#uom-save-button')
      .assert.containsText('#unit-of-measurement-0', unitLabel)

      .click('#unit-of-measurement-0-edit')
      .click('#unit-of-measurement-selector')
      .click('option[label="Proportion (decimal)"]')
      .click('#uom-save-button')
      .assert.containsText('#unit-of-measurement-0', 'Proportion')
      .assert.containsText(firstCell, 'Missing or invalid input');
  },

  'Setting the strength of evidence and uncertainties': function(browser) {
    const strength = 'very strong';
    const uncertainties = 'but also very uncertain';

    manualInputService.createInputDefault(browser);
    browser
      .click('#enter-data-button')
      .waitForElementVisible('#manual-input-header-step2')
      .click('#strength-of-evidence-0-edit')
      .waitForElementVisible('#strength-of-evidence-input')
      .setValue('#strength-of-evidence-input', strength)
      .setValue('#uncertainties-input', uncertainties)
      .click('#save-soe-unc-button')
      .assert.containsText('#strength-of-evidence-0', 'SoE: ' + strength)
      .assert.containsText('#uncertainties-0', 'Unc: ' + uncertainties);
  },

  'Cancel editing unit of measurement': function(browser) {
    manualInputService.createInputDefault(browser);
    browser
      .click('#enter-data-button')
      .click('#unit-of-measurement-0-edit')
      .setValue('#uom-label', 'kg')
      .click('#uom-save-button')
      .click('#unit-of-measurement-0-edit')
      .setValue('#uom-label', 'l')
      .click('#close-modal-button')
      .assert.containsText('#unit-of-measurement-0', 'kg');
  },

  'Cancel editing uncertainty': function(browser) {
    manualInputService.createInputDefault(browser);
    browser
      .click('#enter-data-button')
      .click('#strength-of-evidence-0-edit')
      .setValue('#uncertainties-input', 'none')
      .click('#save-soe-unc-button')
      .click('#strength-of-evidence-0-edit')
      .setValue('#uncertainties-input', 'not none')
      .click('#close-modal-button')
      .assert.containsText('#uncertainties-0', 'Unc: none');
  }
};

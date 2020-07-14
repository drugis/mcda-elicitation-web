'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Editing a title': editTitle,
  'Editing context': editContext,
  'Toggling favourability': toggleFavourability,
  'Changing favourability of a criterion': changeCriterionFavourability,
  'Adding a criterion': addCriterion,
  'Deleting a criterion': deleteCriterion,
  'Moving a criterion': moveCriterion,
  'Editing criterion title': editCriterionTitle,
  'Editing criterion description': editCriterionDescription,
  'Adding a data source': addDataSource,
  'Deleting a data source': deleteDataSource,
  'Moving a data source': moveDataSource,
  'Editing unit of measurement': editUnitOfMeaurement,
  'Editing strength of evidence': editSterengthOfEvidence,
  'Editing uncertainties': editUncertainties,
  'Editing reference': editReference,
  'Adding an alternative': addAlternative,
  'Deleting an alternative': deleteAlternative,
  'Moving an alternative': moveAlternative,
  'Editing the alternative title': editAlternative
};

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const workspaceService = require('./util/workspaceService');

const NEW_CRITERION_TITLE = 'new criterion';
const NEW_CRITERION_DESCRIPTION = 'new description';
const NEW_REFERENCE = 'new reference';
const NEW_STRENGTH_OF_EVIDENCE = 'new strength';
const NEW_UNCERTAINTY = 'new uncertainty';
const NEW_ALTERNATIVE_TITLE = 'new title';

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  manualInputService.createInputDefault(browser);
}

function afterEach(browser) {
  workspaceService.deleteUnfinishedFromList(browser, 0);
  browser.end();
}

function editTitle(browser) {
  browser
    .clearValue('#workspace-title')
    .setValue('#workspace-title', 'another title')
    .pause(500)
    .click('#logo')
    .assert.containsText('#in-progress-workspace-0', 'another title');
}

function editContext(browser) {
  browser
    .setValue('#therapeutic-context', 'therapeutic context')
    .pause(500)
    .click('#logo')
    .click('#in-progress-workspace-0')
    .assert.containsText('#therapeutic-context', 'therapeutic context')
    .click('#logo');
}

function toggleFavourability(browser) {
  browser
    .waitForElementVisible('#favourable-criteria-label')
    .waitForElementVisible('#unfavourable-criteria-label')
    .waitForElementVisible('#add-favourable-criterion-cell')
    .waitForElementVisible('#add-unfavourable-criterion-cell')
    .click('#favourability-checkbox')
    .assert.not.elementPresent('#favourable-criteria-label')
    .assert.not.elementPresent('#unfavourable-criteria-label')
    .assert.not.elementPresent('#add-favourable-criterion-cell')
    .waitForElementVisible('#add-unfavourable-criterion-cell')
    .click('#logo');
}

function changeCriterionFavourability(browser) {
  const criterionTitle = 'criterion 2';
  const favourableCriterionTitlePath = '//tbody/tr[4]/td[3]/span/span';
  const unFavourableCriterionTitlePath = '//tbody/tr[6]/td[3]/span/span';

  browser.perform(function () {
    browser.useXpath().getAttribute('//tbody/tr[4]', 'id', function (result) {
      var criterionId = result.value.split('-').slice(2).join('-');
      var makeUnfavourableButton =
        '//*[@id="make-unfavourable-' + criterionId + '"]';
      var makeFavourableButton =
        '//*[@id="make-favourable-' + criterionId + '"]';
      browser
        .waitForElementVisible(makeUnfavourableButton)
        .click(makeUnfavourableButton)
        .assert.containsText(unFavourableCriterionTitlePath, criterionTitle)
        .waitForElementVisible(makeFavourableButton)
        .click(makeFavourableButton)
        .assert.containsText(favourableCriterionTitlePath, criterionTitle)
        .useCss()
        .click('#logo');
    });
  });
}

function addCriterion(browser) {
  browser
    .useXpath()
    .click('//tbody/tr[6]/td/button')
    .assert.containsText('//tbody/tr[6]/td[3]/span/span', 'new criterion')
    .useCss()
    .click('#logo');
}

function deleteCriterion(browser) {
  browser
    .useXpath()
    .click('//tbody/tr[4]/td[1]/div/div[1]/button')
    .assert.containsText(
      '//*[@id="manualInput"]/span/div/div/div[8]/div[1]',
      'At least two criteria are required'
    )
    .useCss()
    .click('#logo');
}

function moveCriterion(browser) {
  browser.perform(function () {
    browser.useXpath().getAttribute('//tbody/tr[2]', 'id', function (result) {
      var criterionId = result.value.split('-').slice(2).join('-');
      var moveDownButton = '//*[@id="move-criterion-down-' + criterionId + '"]';
      var moveUpButton = '//*[@id="move-criterion-up-' + criterionId + '"]';
      browser.assert
        .containsText('//tbody/tr[2]/td[3]/span/span', 'criterion 1')
        .click(moveDownButton)
        .assert.containsText('//tbody/tr[2]/td[3]/span/span', 'criterion 2')
        .click(moveUpButton)
        .assert.containsText('//tbody/tr[2]/td[3]/span/span', 'criterion 1')
        .useCss()
        .click('#logo');
    });
  });
}

function editCriterionTitle(browser) {
  browser.perform(function () {
    browser.useXpath().getAttribute('//tbody/tr[2]', 'id', function (result) {
      var criterionId = result.value.split('-').slice(2).join('-');
      var basePath = '//*[@id="criterion-title-' + criterionId + '"]';
      browser.assert
        .containsText(basePath + '/span/span', 'criterion 1')
        .click(basePath + '/span/span')
        .clearValue(basePath + '/div/div/input')
        .click(basePath + '/span/span')
        .setValue(basePath + '/div/div/input', NEW_CRITERION_TITLE)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(basePath + '/span/span', NEW_CRITERION_TITLE)
        .useCss()
        .click('#logo');
    });
  });
}

function editCriterionDescription(browser) {
  browser.perform(function () {
    browser.useXpath().getAttribute('//tbody/tr[2]', 'id', function (result) {
      var criterionId = result.value.split('-').slice(2).join('-');
      var basePath = '//*[@id="criterion-description-' + criterionId + '"]';
      browser.assert
        .containsText(basePath + '/span/span', '')
        .click(basePath + '/span/span')
        .setValue(basePath + '/div/div/textarea[1]', NEW_CRITERION_DESCRIPTION)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(basePath + '/span/span', NEW_CRITERION_DESCRIPTION)
        .useCss()
        .click('#logo');
    });
  });
}

function addDataSource(browser) {
  browser.perform(function () {
    browser.useXpath().getAttribute('//tbody/tr[2]', 'id', function (result) {
      var criterionId = result.value.split('-').slice(2).join('-');
      browser
        .click('//*[@id="add-ds-for-' + criterionId + '"]')
        .assert.containsText(
          '//*[@id="criterion-row-' + criterionId + '"]/td[8]/span/span',
          NEW_REFERENCE
        )
        .useCss()
        .click('#logo');
    });
  });
}

function deleteDataSource(browser) {
  browser.perform(function () {
    browser
      .useXpath()
      .getAttribute('//tbody/tr[2]/td[12]', 'id', function (result) {
        var dataSourceId = result.value.split('-').slice(2).join('-');
        browser
          .click('//*[@id="delete-ds-' + dataSourceId + '"]')
          .assert.containsText(
            '//*[@id="manualInput"]/span/div/div/div[8]/div[1]',
            'All criteria require at least one reference'
          )
          .useCss()
          .click('#logo');
      });
  });
}

function moveDataSource(browser) {
  browser
    .useXpath()
    .click('//table/tbody/tr[3]/td/button')
    .perform(function () {
      browser.getAttribute('//tbody/tr[2]/td[12]', 'id', function (result) {
        var dataSourceId = result.value.split('-').slice(2).join('-');
        browser
          .click('//*[@id="move-ds-down-' + dataSourceId + '"]')
          .assert.containsText(
            '//table/tbody/tr[2]/td[12]/span/span',
            NEW_REFERENCE
          )
          .click('//*[@id="move-ds-up-' + dataSourceId + '"]')
          .assert.containsText(
            '//table/tbody/tr[3]/td[8]/span/span',
            NEW_REFERENCE
          )
          .useCss()
          .click('#logo');
      });
    });
}

function editUnitOfMeaurement(browser) {
  browser.perform(function () {
    browser
      .useXpath()
      .getAttribute('//tbody/tr[2]/td[12]', 'id', function (result) {
        var dataSourceId = result.value.split('-').slice(2).join('-');
        var basePath = '//*[@id="ds-unit-' + dataSourceId + '"]';
        browser.assert
          .containsText(basePath + '/div/div[1]/span', 'click to edit')
          .assert.containsText(
            basePath + '/div/div[2]/span',
            '[-Infinity, Infinity]'
          )
          .click(basePath + '/div/div[1]/span')
          .click('//*[@id="unit-type-selector"]')
          .click('//*[@id="menu-"]/div[3]/ul/li[3]')
          .pause(500)
          .click('//*[@id="edit-unit-button"]')
          .assert.containsText(basePath + '/div/div[1]/span', '%')
          .assert.containsText(basePath + '/div/div[2]/span', '[0, 100]')
          .useCss()
          .click('#logo');
      });
  });
}

function editSterengthOfEvidence(browser) {
  browser.perform(function () {
    browser
      .useXpath()
      .getAttribute('//tbody/tr[2]/td[12]', 'id', function (result) {
        var dataSourceId = result.value.split('-').slice(2).join('-');
        var basePath = '//*[@id="ds-soe-unc-' + dataSourceId + '"]';
        browser.assert
          .containsText(basePath + '/div/div/div[2]/span/span', 'click to edit')
          .click(basePath + '/div/div/div[2]/span/span')
          .setValue(
            basePath + '/div/div/div[2]/div/div/input',
            NEW_STRENGTH_OF_EVIDENCE
          )
          .click('//*[@id="favourable-criteria-label"]')
          .assert.containsText(
            basePath + '/div/div/div[2]/span/span',
            NEW_STRENGTH_OF_EVIDENCE
          )
          .useCss()
          .click('#logo');
      });
  });
}

function editUncertainties(browser) {
  browser.perform(function () {
    browser
      .useXpath()
      .getAttribute('//tbody/tr[2]/td[12]', 'id', function (result) {
        var dataSourceId = result.value.split('-').slice(2).join('-');
        var basePath = '//*[@id="ds-soe-unc-' + dataSourceId + '"]';
        browser.assert
          .containsText(basePath + '/div/div/div[4]/span/span', 'click to edit')
          .click(basePath + '/div/div/div[4]/span/span')
          .setValue(basePath + '/div/div/div[4]/div/div/input', NEW_UNCERTAINTY)
          .click('//*[@id="favourable-criteria-label"]')
          .assert.containsText(
            basePath + '/div/div/div[4]/span/span',
            NEW_UNCERTAINTY
          )
          .useCss()
          .click('#logo');
      });
  });
}

function editReference(browser) {
  browser.perform(function () {
    browser
      .useXpath()
      .getAttribute('//tbody/tr[2]/td[12]', 'id', function (result) {
        var dataSourceId = result.value.split('-').slice(2).join('-');
        var basePath = '//*[@id="ds-reference-' + dataSourceId + '"]';
        browser.assert
          .containsText(basePath + '/span/span', 'click to edit')
          .click(basePath + '/span/span')
          .setValue(basePath + '/div/div/input', NEW_REFERENCE)
          .click('//*[@id="favourable-criteria-label"]')
          .assert.containsText(basePath + '/span/span', NEW_REFERENCE)
          .useCss()
          .click('#logo');
      });
  });
}

function addAlternative(browser) {
  browser
    .useXpath()
    .click('//*[@id="add-alternative-button"]')
    .assert.containsText(
      '//*[@id="manual-input-table"]/thead/tr/th[8]/span/span',
      'new alternative'
    )
    .useCss()
    .click('#logo');
}

function deleteAlternative(browser) {
  browser
    .useXpath()
    .click('//thead/tr/th[7]/button[2]')
    .assert.containsText(
      '//*[@id="manualInput"]/span/div/div/div[8]/div[1]',
      'At least two alternatives are required'
    )
    .useCss()
    .click('#logo');
}

function moveAlternative(browser) {
  browser.perform(function () {
    browser
      .useXpath()
      .getAttribute('//thead/tr/th[6]', 'id', function (result) {
        var alternativeId = result.value.split('-').slice(1).join('-');
        browser.assert
          .containsText('//thead/tr/th[6]/span/span', 'alternative 1')
          .click('//*[@id="move-alternative-right-' + alternativeId + '"]')
          .assert.containsText('//thead/tr/th[6]/span/span', 'alternative 2')
          .click('//*[@id="move-alternative-left-' + alternativeId + '"]')
          .assert.containsText('//thead/tr/th[6]/span/span', 'alternative 1')
          .useCss()
          .click('#logo');
      });
  });
}

function editAlternative(browser) {
  browser.perform(function () {
    browser
      .useXpath()
      .getAttribute('//thead/tr/th[6]', 'id', function (result) {
        var alternativeId = result.value.split('-').slice(1).join('-');
        var basePath = '//*[@id="alternative-' + alternativeId + '"]';
        browser.assert
          .containsText(basePath + '/span/span', 'alternative 1')
          .click(basePath + '/span/span')
          .clearValue(basePath + '/div/div/input')
          .click(basePath + '/span/span')
          .setValue(basePath + '/div/div/input', NEW_ALTERNATIVE_TITLE)
          .click('//*[@id="favourable-criteria-label"]')
          .assert.containsText(basePath + '/span/span', NEW_ALTERNATIVE_TITLE)
          .useCss()
          .click('#logo');
      });
  });
}

'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Editing the title': editTitle,
  'Editing context': editContext,
  'Toggling favourability': toggleFavourability,
  'Changing favourability of a criterion': changeCriterionFavourability,
  'Adding a criterion': addCriterion,
  'Deleting a criterion': deleteCriterion,
  'Moving a criterion': moveCriterion,
  'Editing criterion title': editCriterionTitle,
  'Displaying a warning when a criterion title is missing': missingCriterionTitleWarning,
  'Displaying a warning when a criterion has a duplicate title': duplicateCriterionTitleWarning,
  'Editing criterion description': editCriterionDescription,
  'Adding a data source': addDataSource,
  'Deleting a data source': deleteDataSource,
  'Moving a data source': moveDataSource,
  'Setting the unit of measurement to percentage': setUnitOfMeaurementToPercentage,
  'Setting the unit of measurement to decimal': setUnitOfMeaurementToDecimal,
  'Setting the unit of measurement to custom': setUnitOfMeaurementToCustom,
  'Editing strength of evidence': editSterengthOfEvidence,
  'Editing uncertainties': editUncertainties,
  'Editing reference': editReference,
  'Editing reference link': editReferenceLink,
  'Adding an alternative': addAlternative,
  'Deleting an alternative': deleteAlternative,
  'Moving an alternative': moveAlternative,
  'Editing the alternative title': editAlternative,
  'Displaying a warning when an alternative title is missing': missingAlternativeTitleWarning,
  'Displaying a warning when an alternative has a duplicate title': duplicateAlternativeTitleWarning,
  'Finishing creating the workspace': finishCreatingWorkspace,
  'Generating distributions from effects': generateDistributions,
  'Entering effects': enterEffects,
  'Entering distributions': enterDistributions
};

const loginService = require('./util/loginService');
const manualInputService = require('./util/manualInputService');
const workspaceService = require('./util/workspaceService');
const {TEST_URL} = require('./util/constants');

const seleniumDelay = 500;

const FIRST_WARNING_PATH = '//*[@id="warnings"]/div[1]';
const CRITERION_ROW_PATH = '//tbody/tr[2]';
const DATA_SOURCE_PATH = '//tbody/tr[2]/td[12]';
const ALTERNATIVE_PATH = '//thead/tr/th[6]';
const FIRST_CELL = '//tbody/tr[2]/td[8]/span';

const NEW_TITLE = 'new title';
const NEW_THERAPEUTIC_CONTEXT = 'therapeutic context';
const NEW_CRITERION_DESCRIPTION = 'new description';
const NEW_REFERENCE = 'new reference';
const NEW_REFERENCE_LINK = 'http://www.link.com';
const NEW_STRENGTH_OF_EVIDENCE = 'new strength of evidence';
const NEW_UNCERTAINTY = 'new uncertainty';
const DUPLICATE_CRITERION_TITLE = 'criterion 2';
const DUPLICATE_ALTERNATIVE_TITLE = 'alternative 2';
const CUSTOM_UNIT_LABEL = 'custom unit label';

const TOO_FEW_CRITERIA_WARNING = 'At least two criteria are required';
const NO_TITLE_WARNING = 'No title entered';
const TOO_FEW_ALTERNATIVES_WARNING = 'At least two alternatives are required';
const MISSING_REFERENCE_WARNING = 'All criteria require at least one reference';
const MISSING_CRITERIA_TITLE_WARNING = 'Criteria must have a title';
const DUPLICATE_CRITERIA_TITLE_WARNING = 'Criteria must have unique titles';
const MISSING_ALTERNATIVE_TITLE_WARING = 'Alternatives must have a title';
const DUPLICATE_ALTERNATIVES_TITLE_WARNING =
  'Alternatives must have unique titles';
const UNFILLED_VALUES_WARNING =
  'Either effects or distributions must be fully filled out';
const INVDALID_REFERENCE_LINK_WARNING = 'Provided link is not valid';

function getCriterionTitlePaths(criterionId) {
  const basePath = '//*[@id="criterion-title-' + criterionId + '"]';
  return {
    criterionTitle: basePath + '/span/span',
    criterionTitleInput: basePath + '/div/div/input'
  };
}

function getUnitOfMeasurementPaths(dataSourceId) {
  const basePath = '//*[@id="ds-unit-' + dataSourceId + '"]';
  return {
    labelPath: basePath + '/div/div[1]/span',
    boundsPath: basePath + '/div/div[2]/span'
  };
}

function getAlternativePaths(alternativeId) {
  const basePath = '//*[@id="alternative-' + alternativeId + '"]';
  return {
    alternativeTitle: basePath + '/span/span',
    alternativeTitleInput: basePath + '/div/div/input'
  };
}

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  manualInputService.createInputDefault(browser);
}

function afterEach(browser) {
  browser.useCss().url(TEST_URL);
  workspaceService.cleanUnfinishedList(browser);
  workspaceService.cleanList(browser);
  browser.end();
}

function editTitle(browser) {
  browser
    .clearValue('#workspace-title')
    .assert.containsText('#warnings > div:nth-child(1)', NO_TITLE_WARNING)
    .setValue('#workspace-title', 'another title')
    .pause(500) // wait for debounce?
    .click('#logo')
    .assert.containsText('#in-progress-workspace-0', 'another title');
}

function editContext(browser) {
  browser
    .setValue('#therapeutic-context', NEW_THERAPEUTIC_CONTEXT)
    .pause(500)
    .click('#logo')
    .click('#in-progress-workspace-0')
    .assert.containsText('#therapeutic-context', NEW_THERAPEUTIC_CONTEXT);
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
    .waitForElementVisible('#add-unfavourable-criterion-cell');
}

function changeCriterionFavourability(browser) {
  const criterionTitle = 'criterion 2';
  const favourableCriterionTitle = '//tbody/tr[4]/td[3]/span/span';
  const unFavourableCriterionTitle = '//tbody/tr[6]/td[3]/span/span';
  const criterionRow = '//tbody/tr[4]';

  browser.perform(() => {
    browser.useXpath().getAttribute(criterionRow, 'id', (result) => {
      const criterionId = result.value.split('-').slice(2).join('-');
      const makeUnfavourableButton =
        '//*[@id="make-unfavourable-' + criterionId + '"]';
      const makeFavourableButton =
        '//*[@id="make-favourable-' + criterionId + '"]';
      browser
        .waitForElementVisible(makeUnfavourableButton)
        .click(makeUnfavourableButton)
        .assert.containsText(unFavourableCriterionTitle, criterionTitle)
        .waitForElementVisible(makeFavourableButton)
        .click(makeFavourableButton)
        .assert.containsText(favourableCriterionTitle, criterionTitle);
    });
  });
}

function addCriterion(browser) {
  const addCriterionButton = '//*[@id="add-favourable-criterion-cell"]/button';
  const newCriterionTitle = '//tbody/tr[6]/td[3]/span/span';
  browser
    .useXpath()
    .click(addCriterionButton)
    .assert.containsText(newCriterionTitle, 'new criterion');
}

function deleteCriterion(browser) {
  const deleteCriterionButton = '//tbody/tr[4]/td[1]/div/div[1]/button';
  browser
    .useXpath()
    .click(deleteCriterionButton)
    .assert.containsText(FIRST_WARNING_PATH, TOO_FEW_CRITERIA_WARNING);
}

function moveCriterion(browser) {
  const criterionTitle = '//tbody/tr[2]/td[3]/span/span';
  browser.perform(() => {
    browser.useXpath().getAttribute(CRITERION_ROW_PATH, 'id', (result) => {
      const criterionId = result.value.split('-').slice(2).join('-');
      const moveDownButton =
        '//*[@id="move-criterion-down-' + criterionId + '"]';
      const moveUpButton = '//*[@id="move-criterion-up-' + criterionId + '"]';
      browser.assert
        .containsText(criterionTitle, 'criterion 1')
        .click(moveDownButton)
        .assert.containsText(criterionTitle, 'criterion 2')
        .click(moveUpButton)
        .assert.containsText(criterionTitle, 'criterion 1');
    });
  });
}

function editCriterionTitle(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(CRITERION_ROW_PATH, 'id', (result) => {
      const criterionId = result.value.split('-').slice(2).join('-');
      const {criterionTitleInput, criterionTitle} = getCriterionTitlePaths(
        criterionId
      );
      browser.assert
        .containsText(criterionTitle, 'criterion 1')
        .click(criterionTitle)
        .clearValue(criterionTitleInput)
        .click(criterionTitle)
        .setValue(criterionTitleInput, NEW_TITLE)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(criterionTitle, NEW_TITLE);
    });
  });
}

function missingCriterionTitleWarning(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(CRITERION_ROW_PATH, 'id', (result) => {
      const criterionId = result.value.split('-').slice(2).join('-');
      const {criterionTitleInput, criterionTitle} = getCriterionTitlePaths(
        criterionId
      );
      browser
        .click(criterionTitle)
        .clearValue(criterionTitleInput)
        .assert.containsText(criterionTitle, NO_TITLE_WARNING)
        .assert.containsText(
          FIRST_WARNING_PATH,
          MISSING_CRITERIA_TITLE_WARNING
        );
    });
  });
}

function duplicateCriterionTitleWarning(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(CRITERION_ROW_PATH, 'id', (result) => {
      const criterionId = result.value.split('-').slice(2).join('-');
      const {criterionTitleInput, criterionTitle} = getCriterionTitlePaths(
        criterionId
      );
      browser
        .click(criterionTitle)
        .clearValue(criterionTitleInput)
        .click(criterionTitle)
        .setValue(criterionTitleInput, DUPLICATE_CRITERION_TITLE)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(
          FIRST_WARNING_PATH,
          DUPLICATE_CRITERIA_TITLE_WARNING
        );
    });
  });
}

function editCriterionDescription(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(CRITERION_ROW_PATH, 'id', (result) => {
      const criterionId = result.value.split('-').slice(2).join('-');
      const basePath = '//*[@id="criterion-description-' + criterionId + '"]';
      const criterionDescription = basePath + '/span/span';
      const criterionDescriptionInput = basePath + '/div/div/textarea[1]';
      browser.assert
        .containsText(criterionDescription, '')
        .click(criterionDescription)
        .setValue(criterionDescriptionInput, NEW_CRITERION_DESCRIPTION)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(criterionDescription, NEW_CRITERION_DESCRIPTION);
    });
  });
}

function addDataSource(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(CRITERION_ROW_PATH, 'id', (result) => {
      const criterionId = result.value.split('-').slice(2).join('-');
      const addDataSourceButton = '//*[@id="add-ds-for-' + criterionId + '"]';
      const reference =
        '//*[@id="criterion-row-' +
        criterionId +
        '"]/td[8]/div/div[1]/span/span';
      const referenceLink =
        '//*[@id="criterion-row-' +
        criterionId +
        '"]/td[8]/div/div[2]/span/span';
      browser
        .click(addDataSourceButton)
        .assert.containsText(reference, NEW_REFERENCE)
        .assert.containsText(referenceLink, 'click to edit');
    });
  });
}

function deleteDataSource(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const deleteDataSourceButton =
        '//*[@id="delete-ds-' + dataSourceId + '"]';
      browser
        .click(deleteDataSourceButton)
        .assert.containsText(FIRST_WARNING_PATH, MISSING_REFERENCE_WARNING);
    });
  });
}

function moveDataSource(browser) {
  const addDataSourceButton = '//table/tbody/tr[3]/td/button';
  const firstDataSourceReference =
    '//table/tbody/tr[2]/td[12]/div/div[1]/span/span';
  const secondDataSourceReference =
    '//table/tbody/tr[3]/td[8]/div/div[1]/span/span';
  browser
    .useXpath()
    .click(addDataSourceButton)
    .perform(() => {
      browser.getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
        const dataSourceId = result.value.split('-').slice(2).join('-');
        const moveDataSourceDownButton =
          '//*[@id="move-ds-down-' + dataSourceId + '"]';
        const moveDataSourceUpButton =
          '//*[@id="move-ds-up-' + dataSourceId + '"]';
        browser
          .click(moveDataSourceDownButton)
          .assert.containsText(firstDataSourceReference, NEW_REFERENCE)
          .click(moveDataSourceUpButton)
          .assert.containsText(secondDataSourceReference, NEW_REFERENCE);
      });
    });
}

function setUnitOfMeaurementToPercentage(browser) {
  const percentagePath = '//*[@id="unit-type-selector"]/option[3]';
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const {labelPath, boundsPath} = getUnitOfMeasurementPaths(dataSourceId);
      browser.assert
        .containsText(labelPath, 'click to edit')
        .assert.containsText(boundsPath, '[-Infinity, Infinity]')
        .click(labelPath)
        .click('//*[@id="unit-type-selector"]')
        .click(percentagePath)
        .pause(500)
        .click('//*[@id="edit-unit-of-measurement"]')
        .assert.containsText(labelPath, '%')
        .assert.containsText(boundsPath, '[0, 100]');
    });
  });
}

function setUnitOfMeaurementToDecimal(browser) {
  const decimalPath = '//*[@id="unit-type-selector"]/option[2]';
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const {labelPath, boundsPath} = getUnitOfMeasurementPaths(dataSourceId);
      browser.assert
        .containsText(labelPath, 'click to edit')
        .assert.containsText(boundsPath, '[-Infinity, Infinity]')
        .click(labelPath)
        .click('//*[@id="unit-type-selector"]')
        .click(decimalPath)
        .pause(500)
        .click('//*[@id="edit-unit-of-measurement"]')
        .assert.containsText(labelPath, 'click to edit')
        .assert.containsText(boundsPath, '[0, 1]');
    });
  });
}

function setUnitOfMeaurementToCustom(browser) {
  const lowerBoundChoicePath = '//*[@id="unit-lower-bound-selector"]/option[2]';
  const upperBoundChoicePath = '//*[@id="unit-upper-bound-selector"]/option[2]';
  const unitLabelInput = '//*[@id="unit-label"]/div/div/input';
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const {labelPath, boundsPath} = getUnitOfMeasurementPaths(dataSourceId);
      browser.assert
        .containsText(labelPath, 'click to edit')
        .assert.containsText(boundsPath, '[-Infinity, Infinity]')
        .click(labelPath)
        .setValue(unitLabelInput, CUSTOM_UNIT_LABEL)
        .click('//*[@id="unit-lower-bound-selector"]')
        .click(lowerBoundChoicePath)
        .pause(100)
        .click('//*[@id="unit-upper-bound-selector"]')
        .click(upperBoundChoicePath)
        .pause(100)
        .click('//*[@id="edit-unit-of-measurement"]')
        .assert.containsText(labelPath, CUSTOM_UNIT_LABEL)
        .assert.containsText(boundsPath, '[0, 100]');
    });
  });
}

function editSterengthOfEvidence(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const basePath = '//*[@id="ds-soe-unc-' + dataSourceId + '"]';
      const strengthOfEvidence = basePath + '/div/div/div[2]/span/span';
      const strengthOfEvidenceInput =
        basePath + '/div/div/div[2]/div/div/textarea[1]';
      browser.assert
        .containsText(strengthOfEvidence, 'click to edit')
        .click(strengthOfEvidence)
        .setValue(strengthOfEvidenceInput, NEW_STRENGTH_OF_EVIDENCE)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(strengthOfEvidence, NEW_STRENGTH_OF_EVIDENCE);
    });
  });
}

function editUncertainties(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const basePath = '//*[@id="ds-soe-unc-' + dataSourceId + '"]';
      const uncertainties = basePath + '/div/div/div[4]/span/span';
      const uncertaintiesInput =
        basePath + '/div/div/div[4]/div/div/textarea[1]';
      browser.assert
        .containsText(uncertainties, 'click to edit')
        .click(uncertainties)
        .setValue(uncertaintiesInput, NEW_UNCERTAINTY)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(uncertainties, NEW_UNCERTAINTY);
    });
  });
}

function editReference(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const basePath = '//*[@id="ds-reference-' + dataSourceId + '"]';
      const reference = basePath + '/div/div[1]/span/span';
      const referenceInput = basePath + '/div/div[1]/div/div/input';
      browser.assert
        .containsText(reference, 'click to edit')
        .click(reference)
        .setValue(referenceInput, NEW_REFERENCE)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(reference, NEW_REFERENCE);
    });
  });
}

function editReferenceLink(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(DATA_SOURCE_PATH, 'id', (result) => {
      const dataSourceId = result.value.split('-').slice(2).join('-');
      const basePath = '//*[@id="ds-reference-' + dataSourceId + '"]';
      const referenceLink = basePath + '/div/div[2]/span/span';
      const referenceLinkInput = basePath + '/div/div[2]/div/div/input';
      browser.assert
        .containsText(referenceLink, 'click to edit')
        .click(referenceLink)
        .setValue(referenceLinkInput, 'not_a_link')
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(referenceLink, INVDALID_REFERENCE_LINK_WARNING)
        .click(referenceLink)
        .clearValue(referenceLinkInput)
        .click(referenceLink)
        .setValue(referenceLinkInput, NEW_REFERENCE_LINK)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(referenceLink, NEW_REFERENCE_LINK);
    });
  });
}

function addAlternative(browser) {
  const alternativeTitle =
    '//*[@id="manual-input-table"]/thead/tr/th[8]/span/span';
  browser
    .useXpath()
    .click('//*[@id="add-alternative"]')
    .assert.containsText(alternativeTitle, 'new alternative');
}

function deleteAlternative(browser) {
  const deleteAlternative = '//thead/tr/th[7]/div/button[2]';
  browser
    .useXpath()
    .click(deleteAlternative)
    .assert.containsText(FIRST_WARNING_PATH, TOO_FEW_ALTERNATIVES_WARNING);
}

function moveAlternative(browser) {
  const firstAlternativeTitle = '//thead/tr/th[6]/span/span';
  browser.perform(() => {
    browser.useXpath().getAttribute('//thead/tr/th[6]', 'id', (result) => {
      const alternativeId = result.value.split('-').slice(1).join('-');
      const moveAlternativeRight =
        '//*[@id="move-alternative-right-' + alternativeId + '"]';
      const moveAlternativeLeft =
        '//*[@id="move-alternative-left-' + alternativeId + '"]';
      browser.assert
        .containsText(firstAlternativeTitle, 'alternative 1')
        .click(moveAlternativeRight)
        .assert.containsText(firstAlternativeTitle, 'alternative 2')
        .click(moveAlternativeLeft)
        .assert.containsText(firstAlternativeTitle, 'alternative 1');
    });
  });
}

function editAlternative(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(ALTERNATIVE_PATH, 'id', (result) => {
      const alternativeId = result.value.split('-').slice(1).join('-');
      const {alternativeTitleInput, alternativeTitle} = getAlternativePaths(
        alternativeId
      );
      browser.assert
        .containsText(alternativeTitle, 'alternative 1')
        .click(alternativeTitle)
        .clearValue(alternativeTitleInput)
        .click(alternativeTitle)
        .setValue(alternativeTitleInput, NEW_TITLE)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(alternativeTitle, NEW_TITLE);
    });
  });
}

function missingAlternativeTitleWarning(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(ALTERNATIVE_PATH, 'id', (result) => {
      const alternativeId = result.value.split('-').slice(1).join('-');
      const {alternativeTitleInput, alternativeTitle} = getAlternativePaths(
        alternativeId
      );
      browser
        .click(alternativeTitle)
        .clearValue(alternativeTitleInput)
        .assert.containsText(alternativeTitle, NO_TITLE_WARNING)
        .assert.containsText(
          FIRST_WARNING_PATH,
          MISSING_ALTERNATIVE_TITLE_WARING
        );
    });
  });
}

function duplicateAlternativeTitleWarning(browser) {
  browser.perform(() => {
    browser.useXpath().getAttribute(ALTERNATIVE_PATH, 'id', (result) => {
      const alternativeId = result.value.split('-').slice(1).join('-');
      const {alternativeTitleInput, alternativeTitle} = getAlternativePaths(
        alternativeId
      );
      browser
        .click(alternativeTitle)
        .clearValue(alternativeTitleInput)
        .click(alternativeTitle)
        .setValue(alternativeTitleInput, DUPLICATE_ALTERNATIVE_TITLE)
        .click('//*[@id="favourable-criteria-label"]')
        .assert.containsText(
          FIRST_WARNING_PATH,
          DUPLICATE_ALTERNATIVES_TITLE_WARNING
        );
    });
  });
}

function finishCreatingWorkspace(browser) {
  const secondCell = '//tbody/tr[2]/td[9]/span';
  const thirdCell = '//tbody/tr[4]/td[8]/span';
  const fourthCell = '//tbody/tr[4]/td[9]/span';
  const editEffectCell = '//*[@id="edit-effect-cell"]';
  browser
    .useXpath()
    .assert.containsText(FIRST_WARNING_PATH, UNFILLED_VALUES_WARNING)
    .click(FIRST_CELL)
    .pause(seleniumDelay) //selenium tends to click too fast
    .click(editEffectCell)
    .pause(seleniumDelay)
    .click(secondCell)
    .pause(seleniumDelay)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .click(thirdCell)
    .pause(seleniumDelay)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .click(fourthCell)
    .pause(seleniumDelay)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .click('//*[@id="finish-creating-workspace"]')
    .pause(seleniumDelay)
    .getTitle((result) => {
      browser.assert.equal(result, `new workspace's overview`);
    });
}

function generateDistributions(browser) {
  const editEffectCell = '//*[@id="edit-effect-cell"]';
  browser
    .useXpath()
    .assert.containsText('//*[@id="table-input-mode-selector"]', 'Effect')
    .assert.containsText(FIRST_WARNING_PATH, UNFILLED_VALUES_WARNING)
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .click('//*[@id="generate-distributions"]')
    .click('//*[@id="confirm-generating-distributions"]')
    .assert.containsText('//*[@id="table-input-mode-selector"]', 'Distribution')
    .assert.containsText(FIRST_CELL, '0');
}

function enterEffects(browser) {
  const editEffectCell = '//*[@id="edit-effect-cell"]';
  const typeSelector = '//*[@id="input-parameters-selector"]';
  const valueCI = '//*[@id="input-parameters-selector"]/option[2]';
  const range = '//*[@id="input-parameters-selector"]/option[3]';
  const empty = '//*[@id="input-parameters-selector"]/option[4]';
  const text = '//*[@id="input-parameters-selector"]/option[5]';
  const valueInput = '//*[@id="value-input"]';
  const lowerBoundInput = '//*[@id="lower-bound-input"]';
  const upperBoundInput = '//*[@id="upper-bound-input"]';
  const textInput = '//*[@id="text-input"]';
  browser
    .useXpath()
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .pause(seleniumDelay)
    .setValue(valueInput, 1)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 1)
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(valueCI)
    .pause(100)
    .clearValue(valueInput)
    .setValue(valueInput, 2)
    .setValue(lowerBoundInput, 1)
    .setValue(upperBoundInput, 3)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, '2\n(1, 3)')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(range)
    .pause(100)
    .clearValue(lowerBoundInput)
    .setValue(lowerBoundInput, 0)
    .clearValue(upperBoundInput)
    .setValue(upperBoundInput, 1)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, '[0, 1]')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(empty)
    .pause(100)
    .click(editEffectCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 'Empty')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(text)
    .pause(100)
    .setValue(textInput, 'text')
    .click(editEffectCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 'text');
}

function enterDistributions(browser) {
  const editDistributionCell = '//*[@id="edit-distribution-cell"]';
  const typeSelector = '//*[@id="input-parameters-selector"]';
  const beta = '//*[@id="input-parameters-selector"]/option[2]';
  const gamma = '//*[@id="input-parameters-selector"]/option[3]';
  const value = '//*[@id="input-parameters-selector"]/option[4]';
  const range = '//*[@id="input-parameters-selector"]/option[5]';
  const empty = '//*[@id="input-parameters-selector"]/option[6]';
  const text = '//*[@id="input-parameters-selector"]/option[7]';
  const meanInput = '//*[@id="mean-input"]';
  const standardErrorInput = '//*[@id="standard-error-input"]';
  const alphaInput = '//*[@id="alpha-input"]';
  const betaInput = '//*[@id="beta-input"]';
  const valueInput = '//*[@id="value-input"]';
  const lowerBoundInput = '//*[@id="lower-bound-input"]';
  const upperBoundInput = '//*[@id="upper-bound-input"]';
  const textInput = '//*[@id="text-input"]';
  browser
    .useXpath()
    .click('//*[@id="table-input-mode-selector"]')
    .click('//*[@id="table-input-mode-selector"]/option[2]')
    .pause(100)
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .setValue(meanInput, 1)
    .clearValue(standardErrorInput)
    .setValue(standardErrorInput, 2)
    .click(editDistributionCell)
    .pause(seleniumDelay)
    .pause(100)
    .assert.containsText(FIRST_CELL, 'Normal(1, 2)')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(beta)
    .clearValue(alphaInput)
    .setValue(alphaInput, 2)
    .clearValue(betaInput)
    .setValue(betaInput, 3)
    .pause(100)
    .click(editDistributionCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 'Beta(2, 3)')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(gamma)
    .clearValue(alphaInput)
    .setValue(alphaInput, 3)
    .clearValue(betaInput)
    .setValue(betaInput, 4)
    .pause(100)
    .click(editDistributionCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 'Gamma(3, 4)')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(value)
    .setValue(valueInput, 1)
    .pause(100)
    .click(editDistributionCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 1)
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(range)
    .pause(100)
    .clearValue(lowerBoundInput)
    .setValue(lowerBoundInput, 0)
    .clearValue(upperBoundInput)
    .setValue(upperBoundInput, 1)
    .click(editDistributionCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, '[0, 1]')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(empty)
    .pause(100)
    .click(editDistributionCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 'Empty')
    .click(FIRST_CELL)
    .pause(seleniumDelay)
    .click(typeSelector)
    .click(text)
    .pause(100)
    .setValue(textInput, 'text')
    .click(editDistributionCell)
    .pause(seleniumDelay)
    .assert.containsText(FIRST_CELL, 'text');
}

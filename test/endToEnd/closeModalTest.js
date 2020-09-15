'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Cancel editing workspace title': cancelEditingWorkspaceTitle,
  'Cancel editing the therapeutic context': cancelEditingTherapeuticContext,
  'Cancel editing a criterion': cancelEditingCriterion,
  'Cancel editing a data source': cancelEditingDataSource,
  'Cancel editing an alternative': cancelEditingAlternative,
  'Cancel settings': cancelSettings,
  'Cancel editing a subproblem title': cancelEditingSubroblemTitle,
  'Cancel creating a new subproblem': cancelCreatingSubproblem,
  'Cancel setting a partial value function': cancelSettingPartialValueFunction,
  'Cancel setting weights via ranking': cancelSettingRankingWeights,
  'Cancel setting weights via matching': cancelSettingMatchingWeights,
  'Cancel precise swing weighting': cancelSettingPreciseSwingWeights,
  'Cancel imprecise swing weighting': cancelSettingImpreciseSwingWeights,
  'Cancel editing a scenario': cancelEditingScenario,
  'Cancel creating a new scenario': cancelCreatingScenario,
  'Cancel copying a scenario': cancelCopyingScenario,
  'Cancel editing graph labels': cancelEditingGraphLabels
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const util = require('./util/util');

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
const preferenceTabPath = '#preferences-tab';
const importanceCellPath = '#importance-criterion-0';
const closeModalButtonPath = '#close-modal-button';
const cancelStep1Path = '#cancel-step1-button';
const treatmentRespondersId = 'de14e778-f723-48d4-8f4e-1e589714f4f2';

function cancelAction(browser, paths, expectedValue) {
  util
    .delayedClick(browser, paths.tab, paths.actionButton)
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

function beforeEach(browser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');
}

function afterEach(browser) {
  util.delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function cancelEditingWorkspaceTitle(browser) {
  browser
    .click('#edit-workspace-title-button')
    .click('#cancel-workspace-title-button')
    .waitForElementVisible('#workspace-title');
}

function cancelEditingTherapeuticContext(browser) {
  var paths = {
    valueToClear: '#therapeutic-context-input',
    actionButton: '#edit-therapeutic-context-button',
    cancelButton: closeModalButtonPath,
    content: '#therapeutic-context'
  };
  clearValueCancelAction(browser, paths, 'SMAA');
}

function cancelEditingCriterion(browser) {
  var paths = {
    valueToClear: '#criterion-title-input',
    actionButton: '#edit-criterion-0',
    cancelButton: closeModalButtonPath,
    content: '#criterion-title-0'
  };
  clearValueCancelAction(browser, paths, 'Treatment responders');
}

function cancelEditingDataSource(browser) {
  var paths = {
    valueToClear: '#reference-input',
    actionButton: '#edit-data-source-0-0',
    cancelButton: closeModalButtonPath,
    content: '#data-source-reference-0-0'
  };
  clearValueCancelAction(browser, paths, 'Nemeroff and Thase (2007)');
}

function cancelEditingAlternative(browser) {
  var paths = {
    valueToClear: '#alternative-title',
    actionButton: '#edit-alternative-0',
    cancelButton: closeModalButtonPath,
    content: '#alternative-title-0'
  };
  clearValueCancelAction(browser, paths, 'Placebo');
}

function cancelSettings(browser) {
  var actionButtonPath = '#settings-button';
  var contentPath = '#c-0-ds-0-a-0-table-cell';
  browser
    .click(actionButtonPath)
    .click('#show-decimals-radio')
    .click('#smaa-radio')
    .click(closeModalButtonPath)
    .assert.containsText(contentPath, '37 / 101');
}

function cancelEditingSubroblemTitle(browser) {
  var actionButtonPath = '#edit-subproblem-button';
  var contentPath = '#subproblem-selector';
  util
    .delayedClick(browser, '#problem-definition-tab', actionButtonPath)
    .click(actionButtonPath)
    .clearValue('#subproblem-title-input')
    .click(closeModalButtonPath)
    .assert.containsText(contentPath, 'Default');
}

function cancelCreatingSubproblem(browser) {
  var paths = {
    tab: '#problem-definition-tab',
    actionButton: '#create-subproblem-button',
    cancelButton: closeModalButtonPath,
    content: '#subproblem-selector'
  };
  cancelAction(browser, paths, 'Default');
}

function cancelSettingPartialValueFunction(browser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: `#advanced-pvf-button-${treatmentRespondersId}`,
    cancelButton: '#cancel-button',
    content: '#partial-value-functions-header'
  };
  cancelAction(browser, paths, 'Partial Value Functions');
}

function cancelSettingRankingWeights(browser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#ranking-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelSettingMatchingWeights(browser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#matching-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelSettingPreciseSwingWeights(browser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#precise-swing-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelSettingImpreciseSwingWeights(browser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#imprecise-swing-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelEditingScenario(browser) {
  var actionButtonPath = '#edit-scenario-button';
  var cancelButtonPath = closeModalButtonPath;
  var contentPath = '#scenario-selector';
  util
    .delayedClick(browser, '#preferences-tab', actionButtonPath)
    .click(actionButtonPath)
    .clearValue('#new-scenario-title')
    .click(cancelButtonPath)
    .assert.containsText(contentPath, 'Default');
}

function cancelCreatingScenario(browser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#create-scenario-button',
    cancelButton: closeModalButtonPath,
    content: '#scenario-selector'
  };
  cancelAction(browser, paths, 'Default');
}

function cancelCopyingScenario(browser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#copy-scenario-button',
    cancelButton: closeModalButtonPath,
    content: '#scenario-selector'
  };
  cancelAction(browser, paths, 'Default');
}

function cancelEditingGraphLabels(browser) {
  var paths = {
    valueToClear: '#label-input-0',
    tab: '#deterministic-tab',
    actionButton: '//*[@id="value-profile-container"]/div[2]/button',
    cancelButton: closeModalButtonPath,
    content:
      '#value-plot > svg:nth-child(1) > g:nth-child(2) > g:nth-child(6) > g:nth-child(2) > text:nth-child(2) > tspan:nth-child(1)'
  };
  util
    .delayedClick(
      browser,
      paths.tab,
      paths.actionButton,
      util.xpathSelectorType
    )
    .useXpath()
    .click(paths.actionButton)
    .useCss()
    .clearValue(paths.valueToClear)
    .click(paths.cancelButton)
    .assert.containsText(paths.content, 'Placebo');
}

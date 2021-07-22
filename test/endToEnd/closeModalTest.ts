import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import {delayedClick, xpathSelectorType} from './util/util';
import workspaceService from './util/workspaceService';

export = {
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

const title =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
const preferenceTabPath = '#preferences-tab';
const importanceCellPath = '#importance-criterion-treatmentRespondersId';
const closeModalButtonPath = '#close-modal-button';

type Paths = {
  tab?: string;
  actionButton: string;
  cancelButton: string;
  content: string;
  valueToClear?: string;
};

function cancelAction(
  browser: NightwatchBrowser,
  paths: Paths,
  expectedValue: string
) {
  delayedClick(browser, paths.tab, paths.actionButton)
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

function beforeEach(browser: NightwatchBrowser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService
    .addExample(browser, title)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');
}

function afterEach(browser: NightwatchBrowser) {
  delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function cancelEditingWorkspaceTitle(browser: NightwatchBrowser) {
  browser
    .click('#edit-workspace-title-button')
    .click('#close-modal-button')
    .expect.element('#workspace-title')
    .text.to.equal(title);
}

function cancelEditingTherapeuticContext(browser: NightwatchBrowser) {
  var paths: Paths = {
    valueToClear: '#therapeutic-context-input',
    actionButton: '#edit-therapeutic-context-button',
    cancelButton: closeModalButtonPath,
    content: '#therapeutic-context'
  };
  clearValueCancelAction(browser, paths, 'SMAA');
}

function cancelEditingCriterion(browser: NightwatchBrowser) {
  var paths = {
    valueToClear: '#criterion-title-input',
    actionButton: '#edit-criterion-button-treatmentRespondersId',
    cancelButton: closeModalButtonPath,
    content: '#criterion-title-treatmentRespondersId'
  };
  clearValueCancelAction(browser, paths, 'Treatment responders');
}

function cancelEditingDataSource(browser: NightwatchBrowser) {
  var paths = {
    valueToClear: '#reference-input',
    actionButton:
      '#edit-data-source-button-029909c4-cb8c-43cb-9816-e8550ef561be',
    cancelButton: closeModalButtonPath,
    content: '#reference-029909c4-cb8c-43cb-9816-e8550ef561be'
  };
  clearValueCancelAction(browser, paths, 'Nemeroff and Thase (2007)');
}

function cancelEditingAlternative(browser: NightwatchBrowser) {
  var paths = {
    valueToClear: '#alternative-title-input',
    actionButton: '#edit-alternative-button-placeboId',
    cancelButton: closeModalButtonPath,
    content: '#alternative-title-placeboId'
  };
  clearValueCancelAction(browser, paths, 'Placebo');
}

function cancelSettings(browser: NightwatchBrowser) {
  var actionButtonPath = '#settings-button';
  var contentPath =
    '#value-cell-029909c4-cb8c-43cb-9816-e8550ef561be-placeboId';
  browser
    .click(actionButtonPath)
    .click('#show-decimals-radio')
    .click('#display-mode-selector')
    .click('option[value="enteredDistributions"]')
    .click(closeModalButtonPath)
    .assert.containsText(contentPath, '36.6');
}

function cancelEditingSubroblemTitle(browser: NightwatchBrowser) {
  var actionButtonPath = '#edit-subproblem-button';
  var contentPath = '#subproblem-selector';
  delayedClick(browser, '#problem-definition-tab', actionButtonPath)
    .click(actionButtonPath)
    .clearValue('#subproblem-title-input')
    .click(closeModalButtonPath)
    .assert.containsText(contentPath, 'Default');
}

function cancelCreatingSubproblem(browser: NightwatchBrowser) {
  var paths = {
    tab: '#problem-definition-tab',
    actionButton: '#add-subproblem-button',
    cancelButton: closeModalButtonPath,
    content: '#subproblem-selector'
  };
  cancelAction(browser, paths, 'Default');
}

function cancelSettingPartialValueFunction(browser: NightwatchBrowser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: `#advanced-pvf-button-treatmentRespondersId`,
    cancelButton: '#cancel-button',
    content: '#partial-value-functions-header'
  };
  cancelAction(browser, paths, 'Partial Value Functions');
}

function cancelSettingRankingWeights(browser: NightwatchBrowser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#ranking-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelSettingMatchingWeights(browser: NightwatchBrowser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#matching-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelSettingPreciseSwingWeights(browser: NightwatchBrowser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#precise-swing-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelSettingImpreciseSwingWeights(browser: NightwatchBrowser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#imprecise-swing-button',
    cancelButton: '#cancel-button',
    content: importanceCellPath
  };
  cancelAction(browser, paths, '?');
}

function cancelEditingScenario(browser: NightwatchBrowser) {
  var actionButtonPath = '#edit-scenario-button';
  var cancelButtonPath = closeModalButtonPath;
  var contentPath = '#scenario-selector';
  delayedClick(browser, '#preferences-tab', actionButtonPath)
    .click(actionButtonPath)
    .clearValue('#new-scenario-title')
    .click(cancelButtonPath)
    .assert.containsText(contentPath, 'Default');
}

function cancelCreatingScenario(browser: NightwatchBrowser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#add-scenario-button',
    cancelButton: closeModalButtonPath,
    content: '#scenario-selector'
  };
  cancelAction(browser, paths, 'Default');
}

function cancelCopyingScenario(browser: NightwatchBrowser) {
  var paths = {
    tab: preferenceTabPath,
    actionButton: '#copy-scenario-button',
    cancelButton: closeModalButtonPath,
    content: '#scenario-selector'
  };
  cancelAction(browser, paths, 'Default');
}

function cancelEditingGraphLabels(browser: NightwatchBrowser) {
  var paths = {
    valueToClear: '#label-input-0',
    tab: '#deterministic-results-tab',
    actionButton: '//*[@id="value-profile-plot-base-legend"]',
    cancelButton: closeModalButtonPath,
    content:
      '#value-profile-plot-base > svg > g:nth-child(2) > g.c3-axis.c3-axis-x > g:nth-child(2) > text > tspan'
  };
  delayedClick(browser, paths.tab, paths.actionButton, xpathSelectorType)
    .useXpath()
    .click(paths.actionButton)
    .useCss()
    .clearValue(paths.valueToClear)
    .click(paths.cancelButton)
    .assert.containsText(paths.content, 'Placebo');
}

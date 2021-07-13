import {NightwatchBrowser} from 'nightwatch';
import errorService from './util/errorService';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

export = {
  beforeEach,
  afterEach,
  'Setting the weights through threshold elicitation': threshold,
  'Go back during threshold elicitation': goBack,
  'Cancel threshold elicitation': cancel,
  'Change settings during threshold elicitation': changeSettings,
  'Disable threshold elicitation if not all pvfs are linear': nonLinearPvfs
};

const PERCENTAGE_STATEMENT =
  "For each other criterion, adjust its value so that it answers the question 'What is the minimum improvement in this criterion that would make the worsening in 2-year survival by 1 % acceptable?'";
const DECIMAL_STATEMENT =
  "For each other criterion, adjust its value so that it answers the question 'What is the minimum improvement in this criterion that would make the worsening in 2-year survival by 0.01 acceptable?'";

function beforeEach(browser: NightwatchBrowser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  loadTestWorkspace(browser);
  browser.pause(1000);
}

function loadTestWorkspace(browser: NightwatchBrowser) {
  workspaceService
    .addExample(browser, 'GetReal course LU 4, activity 4.4')
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');

  errorService
    .isErrorBarNotPresent(browser)
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

function afterEach(browser: NightwatchBrowser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function threshold(browser: NightwatchBrowser) {
  goToThresholdElicitation(browser);
  checkStep1Values(browser);
  goToStep2(browser);
  checkStep2PercentageValues(browser);
  browser
    .click('#save-button')
    .waitForElementVisible('#partial-value-functions-block');
  browser.expect
    .element('#elicitation-method')
    .text.to.equal('Elicitation method: Threshold');
  browser.expect.element('#equivalent-change-OS').text.to.equal('10');
  browser.expect.element('#equivalent-change-severe').text.to.equal('-40');
  browser.expect.element('#equivalent-change-moderate').text.to.equal('-20');
}

function goBack(browser: NightwatchBrowser) {
  goToThresholdElicitation(browser);
  checkStep1Values(browser);
  goToStep2(browser).click('#previous-button');
  browser.expect.element('#step-counter').text.to.equal('Step 1 of 2');
}

function cancel(browser: NightwatchBrowser) {
  goToThresholdElicitation(browser)
    .click('#cancel-button')
    .waitForElementVisible('#partial-value-functions-block');
}

function changeSettings(browser: NightwatchBrowser) {
  goToThresholdElicitation(browser);
  checkStep1Values(browser)
    .click('#settings-button')
    .click('#show-decimals-radio')
    .click('#save-settings-button');
  goToStep2(browser);
  checkStep2DecimalValues(browser)
    .click('#settings-button')
    .click('#show-percentages-radio')
    .click('#save-settings-button');
  checkStep2PercentageValues(browser)
    .click('#save-button')
    .waitForElementVisible('#partial-value-functions-block');
}

function nonLinearPvfs(browser: NightwatchBrowser) {
  browser
    .click('#advanced-pvf-button-OS')
    .waitForElementVisible('#pvfplot-OS')
    .click('#save-button')
    .waitForElementVisible('#threshold-button:disabled');
}

function goToThresholdElicitation(browser: NightwatchBrowser) {
  browser
    .click('#threshold-button')
    .waitForElementVisible('#threshold-elicitation-title-header')
    .getTitle((result) => {
      browser.assert.equal(result, 'Threshold technique elicitation');
    })
    .waitForElementVisible('#previous-button:disabled')
    .waitForElementVisible('#next-button:disabled')
    .waitForElementNotPresent('#improvement-or-worsening-radio')
    .waitForElementNotPresent('#input-reference-value');
  browser.expect.element('#step-counter').text.to.equal('Step 1 of 2');
  return browser;
}

function checkStep1Values(browser: NightwatchBrowser) {
  browser
    .click('#threshold-reference-criterion-selector')
    .click('#threshold-reference-criterion-selector > option[value=OS]')
    .click('#worsening')
    .waitForElementVisible('#improvement-or-worsening-radio')
    .waitForElementVisible('#input-reference-value');
  return browser;
}

function goToStep2(browser: NightwatchBrowser) {
  browser
    .click('#next-button')
    .waitForElementVisible('#threshold-elicitation-statement');
  browser.expect.element('#step-counter').text.to.equal('Step 2 of 2');
  return browser;
}

function checkStep2PercentageValues(browser: NightwatchBrowser) {
  browser.expect
    .element('#threshold-elicitation-statement')
    .text.to.equal(PERCENTAGE_STATEMENT);
  browser.expect
    .element('#criterion-title-severe')
    .text.to.equal('Severe toxicity');
  browser.expect.element('#input-severe').value.to.equal('4');
  browser.expect
    .element('#criterion-title-moderate')
    .text.to.equal('Moderate toxicity');
  browser.expect.element('#input-moderate').value.to.equal('2');
  return browser;
}

function checkStep2DecimalValues(browser: NightwatchBrowser) {
  browser.expect
    .element('#threshold-elicitation-statement')
    .text.to.equal(DECIMAL_STATEMENT);
  browser.expect
    .element('#criterion-title-severe')
    .text.to.equal('Severe toxicity');
  browser.expect.element('#input-severe').value.to.equal('0.04');
  browser.expect
    .element('#criterion-title-moderate')
    .text.to.equal('Moderate toxicity');
  browser.expect.element('#input-moderate').value.to.equal('0.02');
  return browser;
}

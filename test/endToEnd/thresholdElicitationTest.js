"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const errorService_1 = __importDefault(require("./util/errorService"));
const loginService_1 = __importDefault(require("./util/loginService"));
const workspaceService_1 = __importDefault(require("./util/workspaceService"));
const PERCENTAGE_STATEMENT = "For each other criterion, adjust its value so that it answers the question 'What is the minimum improvement in this criterion that would make the worsening in 2-year survival by 1 % acceptable?'";
const DECIMAL_STATEMENT = "For each other criterion, adjust its value so that it answers the question 'What is the minimum improvement in this criterion that would make the worsening in 2-year survival by 0.01 acceptable?'";
function beforeEach(browser) {
    loginService_1.default.login(browser);
    workspaceService_1.default.cleanList(browser);
    loadTestWorkspace(browser);
    browser.pause(1000);
}
function loadTestWorkspace(browser) {
    workspaceService_1.default
        .addExample(browser, 'GetReal course LU 4, activity 4.4')
        .click('#workspace-0')
        .waitForElementVisible('#workspace-title');
    errorService_1.default
        .isErrorBarNotPresent(browser)
        .click('#preferences-tab')
        .waitForElementVisible('#partial-value-functions-block');
}
function afterEach(browser) {
    browser.click('#logo');
    workspaceService_1.default.deleteFromList(browser, 0).end();
}
function threshold(browser) {
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
function goBack(browser) {
    goToThresholdElicitation(browser);
    checkStep1Values(browser);
    goToStep2(browser).click('#previous-button');
    browser.expect.element('#step-counter').text.to.equal('Step 1 of 2');
}
function cancel(browser) {
    goToThresholdElicitation(browser)
        .click('#cancel-button')
        .waitForElementVisible('#partial-value-functions-block');
}
function changeSettings(browser) {
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
function nonLinearPvfs(browser) {
    browser
        .click('#advanced-pvf-button-OS')
        .waitForElementVisible('#pvfplot-OS')
        .click('#save-button')
        .waitForElementVisible('#threshold-button:disabled');
}
function goToThresholdElicitation(browser) {
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
function checkStep1Values(browser) {
    browser
        .click('#threshold-reference-criterion-selector')
        .click('#threshold-reference-criterion-selector > option[value=OS]')
        .click('#worsening')
        .waitForElementVisible('#improvement-or-worsening-radio')
        .waitForElementVisible('#input-reference-value');
    return browser;
}
function goToStep2(browser) {
    browser
        .click('#next-button')
        .waitForElementVisible('#threshold-elicitation-statement');
    browser.expect.element('#step-counter').text.to.equal('Step 2 of 2');
    return browser;
}
function checkStep2PercentageValues(browser) {
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
function checkStep2DecimalValues(browser) {
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
module.exports = {
    beforeEach,
    afterEach,
    'Setting the weights through threshold elicitation': threshold,
    'Go back during threshold elicitation': goBack,
    'Cancel threshold elicitation': cancel,
    'Change settings during threshold elicitation': changeSettings,
    'Disable threshold elicitation if not all pvfs are linear': nonLinearPvfs
};

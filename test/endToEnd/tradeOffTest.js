"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var loginService_1 = __importDefault(require("./util/loginService"));
var util_1 = __importDefault(require("./util/util"));
var workspaceService_1 = __importDefault(require("./util/workspaceService"));
function beforeEach(browser) {
    browser.resizeWindow(1366, 728);
    var workspaceTitle = 'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)';
    loginService_1["default"].login(browser);
    workspaceService_1["default"].cleanList(browser);
    workspaceService_1["default"].addExample(browser, workspaceTitle);
    browser.expect.element('#workspace-0').text.to.equal(workspaceTitle);
    browser
        .click('#workspace-0')
        .waitForElementVisible('#workspace-title')
        .click('#preferences-tab');
}
function afterEach(browser) {
    util_1["default"].delayedClick(browser, '#logo', '#workspaces-header');
    workspaceService_1["default"].deleteFromList(browser, 0).end();
}
function tradeOffTest(browser) {
    browser
        .waitForElementVisible('#precise-swing-button')
        .click('#precise-swing-button')
        .waitForElementVisible('#swing-weighting-title-header')
        .click('#ranking-choice-HAM-D')
        .click('#next-button')
        .click('#save-button')
        .waitForElementVisible('#trade-off-header');
    checkEqualValues(browser, 90);
    browser
        .click('#reference-slider-from')
        .useXpath()
        .click('/html/body/div[3]/div[3]/div/div[2]/span/span[3]')
        .sendKeys('/html/body/div[3]/div[3]', browser.Keys.ESCAPE)
        .useCss()
        .waitForElementVisible('#trade-off-header');
    checkEqualValues(browser, 45);
    browser
        .pause(250)
        .click('#reference-slider-to')
        .useXpath()
        .click('/html/body/div[3]/div[3]/div/div[2]/span/span[13]')
        .sendKeys('/html/body/div[3]/div[3]', browser.Keys.ESCAPE)
        .useCss()
        .waitForElementVisible('#trade-off-header');
    checkEqualValues(browser, 0);
}
function checkEqualValues(browser, value) {
    browser.expect
        .element('#trade-off-statement-Diarrhea')
        .text.to.equal("Changing Diarrhea from 100 to " + value);
    browser.expect
        .element('#trade-off-statement-Dizziness')
        .text.to.equal("Changing Dizziness from 100 to " + value);
    browser.expect
        .element('#trade-off-statement-Headache')
        .text.to.equal("Changing Headache from 100 to " + value);
    browser.expect
        .element('#trade-off-statement-Insomnia')
        .text.to.equal("Changing Insomnia from 100 to " + value);
    browser.expect
        .element('#trade-off-statement-Nausea')
        .text.to.equal("Changing Nausea from 100 to " + value);
}
function changeReferenceCriterion(browser) {
    browser
        .waitForElementVisible('#precise-swing-button')
        .assert.containsText('#reference-criterion-selector', 'HAM-D')
        .click('#reference-criterion-selector')
        .click('#reference-criterion-selector > option:nth-child(1)')
        .pause(100) //pause needed to not get 'stale element' error
        .assert.containsText('#reference-criterion-selector', 'Diarrhea');
}
function unrealisticValues(browser) {
    browser
        .waitForElementVisible('#precise-swing-button')
        .click('#reference-slider-from')
        .useXpath()
        .click('/html/body/div[3]/div[3]/div/div[2]/span/span[3]')
        .sendKeys('/html/body/div[3]/div[3]', browser.Keys.ESCAPE)
        .useCss()
        .waitForElementVisible('#trade-off-header');
    browser
        .pause(250)
        .click('#reference-slider-to')
        .useXpath()
        .click('/html/body/div[3]/div[3]/div/div[2]/span/span[13]')
        .sendKeys('/html/body/div[3]/div[3]', browser.Keys.ESCAPE)
        .useCss()
        .waitForElementVisible('#trade-off-header');
    browser.expect.element('#trade-off-warning-Diarrhea').text.to.equal('');
    browser.expect
        .element('#trade-off-warning-Dizziness')
        .text.to.equal("This value is unrealistic given the criterion's range");
    browser.expect
        .element('#trade-off-warning-Headache')
        .text.to.equal("This value is unrealistic given the criterion's range");
    browser.expect
        .element('#trade-off-warning-Insomnia')
        .text.to.equal("This value is unrealistic given the criterion's range");
    browser.expect
        .element('#trade-off-warning-Nausea')
        .text.to.equal("This value is unrealistic given the criterion's range");
}
module.exports = {
    beforeEach: beforeEach,
    afterEach: afterEach,
    'Trade offs': tradeOffTest,
    'Changing reference criterion': changeReferenceCriterion,
    'Show warning for unrealistic values': unrealisticValues
};
//# sourceMappingURL=tradeOffTest.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var loginService_1 = __importDefault(require("./util/loginService"));
var workspaceService_1 = __importDefault(require("./util/workspaceService"));
function beforeEach(browser) {
    browser.resizeWindow(1366, 728);
    loginService_1["default"].login(browser);
    workspaceService_1["default"].cleanList(browser);
}
function afterEach(browser) {
    browser.click('#logo');
    workspaceService_1["default"].deleteFromList(browser, 0).end();
}
function checkEnteredValuesDisabled(browser) {
    workspaceService_1["default"]
        .addExample(browser, 'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)')
        .click('#workspace-0')
        .waitForElementVisible('#workspace-title')
        .useCss()
        .click('#settings-button')
        .waitForElementVisible('#entered-radio:disabled')
        .click('#close-modal-button');
}
function checkEnteredEffectsDisabled(browser) {
    workspaceService_1["default"]
        .uploadTestWorkspace(browser, '/onlyDistributionsProblem.json')
        .waitForElementVisible('#workspace-title')
        .useCss()
        .click('#settings-button')
        .waitForElementVisible('#save-settings-button:enabled')
        .click('#deterministic-radio')
        .waitForElementVisible('#save-settings-button:disabled')
        .assert.containsText('#settings-warnings', 'No entered data available for deterministic analysis.')
        .click('#close-modal-button');
}
module.exports = {
    beforeEach: beforeEach,
    afterEach: afterEach,
    'Check if entered values view is disabled for relative problem': checkEnteredValuesDisabled,
    'Check if entered effects view is disabled for problem with only distributions': checkEnteredEffectsDisabled
};
//# sourceMappingURL=settingsTest2.js.map
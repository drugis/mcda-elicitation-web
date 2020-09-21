import {NightwatchBrowser} from 'nightwatch';
import {TEST_URL} from './util/constants';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

export = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Check if entered values view is disabled for relative problem': checkEnteredValuesDisabled,
  'Check if entered effects view is disabled for problem with only distributions': checkEnteredEffectsDisabled
};

function beforeEach(browser: NightwatchBrowser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
}

function afterEach(browser: NightwatchBrowser) {
  browser.url(TEST_URL);
  workspaceService.deleteFromList(browser, 0).end();
}

function checkEnteredValuesDisabled(browser: NightwatchBrowser) {
  workspaceService
    .addExample(
      browser,
      'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)'
    )
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .useCss()
    .click('#settings-button')
    .waitForElementVisible('#entered-radio:disabled')
    .click('#close-modal-button');
}

function checkEnteredEffectsDisabled(browser: NightwatchBrowser) {
  workspaceService
    .uploadTestWorkspace(browser, '/onlyDistributionsProblem.json')
    .waitForElementVisible('#workspace-title')
    .useCss()
    .click('#settings-button')
    .waitForElementVisible('#save-settings-button:enabled')
    .click('#deterministic-radio')
    .waitForElementVisible('#save-settings-button:disabled')
    .assert.containsText(
      '#settings-warnings',
      'No entered data available for deterministic analysis.'
    )
    .click('#close-modal-button');
}

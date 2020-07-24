import loginService from './util/loginService';
import workspaceService from './util/workspaceService';
import util from './util/util';
import _ from 'lodash';
import {NightwatchBrowser} from 'nightwatch';

export = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Check if entered values view is disabled for relative problem': checkEnteredValuesDisabled
};

function beforeEach(browser: NightwatchBrowser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
}

function afterEach(browser: NightwatchBrowser) {
  browser.useCss();
  browser.click('#logo');
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
    .click('#close-modal-button')
    .useXpath();
}

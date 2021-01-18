import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

const workspacePath = '/partialValueFunctionTestProblem.json';

export = {
  'Show only scenarios with Pvfs on the Smaa tab': smaa
};

function smaa(browser: NightwatchBrowser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(browser, workspacePath);
  browser
    .waitForElementVisible('#workspace-title')
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block')
    .click('#add-scenario-button')
    .waitForElementVisible('#new-scenario-title')
    .setValue('#new-scenario-title', 'pvfs')
    .click('#add-scenario-confirm-button')
    .waitForElementNotPresent('#add-scenario-confirm-button')
    .click('#increasing-pvf-button-c1')
    .click('#increasing-pvf-button-c2')
    .pause(200)
    .click('#smaa-tab')
    .waitForElementVisible('#scenario-selector')
    .click('#scenario-selector')
    .waitForElementVisible('#scenario-selector > option:nth-child(1)')
    .waitForElementNotPresent('#scenario-selector > option:nth-child(2)')
    .click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

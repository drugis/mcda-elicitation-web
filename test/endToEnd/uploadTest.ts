import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService.js';
import {delayedClick} from './util/util';
import workspaceService from './util/workspaceService.js';

module.exports = {
  beforeEach: (browser: NightwatchBrowser) => {
    browser.resizeWindow(1366, 728);
    loginService.login(browser);
    workspaceService.cleanList(browser);
  },
  afterEach: (browser: NightwatchBrowser) => {
    browser.end();
  },
  'Upload a workspace': uploadSuccess,
  'Upload an unparsable workspace': uploadUnparseable,
  'Upload a file with schema error': uploadSchemaError
};

function uploadSuccess(browser: NightwatchBrowser) {
  const title = 'GetReal course LU 4, activity 4.4';
  const workspacePath = '../../../../examples/regular-examples/getreal.json';
  workspaceService.uploadTestWorkspace(browser, workspacePath);
  browser.assert.containsText('#workspace-title', title);
  delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function uploadUnparseable(browser: NightwatchBrowser) {
  const workspacePath = '/util/emptyProblem.json';
  const error =
    'JSON.parse: unexpected end of data at line 1 column 1 of the JSON data';
  uploadSomething(browser, workspacePath, error).assert.containsText(
    '#invalid-schema-error-0',
    error
  );
}

function uploadSchemaError(browser: NightwatchBrowser) {
  const workspacePath = '/util/schemaFails.json';
  const error = '/criteria should NOT have fewer than 2 items';
  uploadSomething(browser, workspacePath, error);
}

function uploadSomething(
  browser: NightwatchBrowser,
  path: string,
  error: string
): NightwatchBrowser {
  return browser
    .waitForElementVisible('#create-workspace-button')
    .click('#create-workspace-button')
    .click('#upload-workspace-radio')
    .setValue(
      '#workspace-upload-input',
      require('path').resolve(__dirname + path)
    )
    .pause(300)
    .assert.containsText('#invalid-schema-error-0', error);
}

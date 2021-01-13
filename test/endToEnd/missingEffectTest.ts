import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

export = {
  'Check for no error when effect is missing and distribution is empty': missingEffect
};

function missingEffect(browser: NightwatchBrowser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(
    browser,
    '/withEmptyDistributionAndNoEffectProblem.json'
  );
  browser.end();
}

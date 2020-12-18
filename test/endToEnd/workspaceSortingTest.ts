import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

export = {
  'Sort workspaces': sortWorkspaces
};

function sortWorkspaces(browser: NightwatchBrowser) {
  const workspaceTitle1 = 'GetReal course LU 4, activity 4.4';
  const workspaceTitle2 =
    'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.addExample(browser, workspaceTitle1);
  browser.expect.element('#workspace-0').text.to.equal(workspaceTitle1);

  workspaceService.addExample(browser, workspaceTitle2);
  browser.expect.element('#workspace-0').text.to.equal(workspaceTitle2);
  browser.expect.element('#workspace-1').text.to.equal(workspaceTitle1);

  browser.click('#sort-workspaces-by-title');
  browser.expect.element('#workspace-0').text.to.equal(workspaceTitle1);
  browser.expect.element('#workspace-1').text.to.equal(workspaceTitle2);

  browser.click('#sort-workspaces-by-creation-date');
  browser.expect.element('#workspace-0').text.to.equal(workspaceTitle1);
  browser.expect.element('#workspace-1').text.to.equal(workspaceTitle2);

  browser.click('#sort-workspaces-by-creation-date');
  browser.expect.element('#workspace-0').text.to.equal(workspaceTitle2);
  browser.expect.element('#workspace-1').text.to.equal(workspaceTitle1);
}

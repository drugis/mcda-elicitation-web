import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import workspaceService, {cleanList} from './util/workspaceService';

export = {
  afterEach,
  'Filter workspaces by criteria and alternatives': filterByBoth
};

function afterEach(browser: NightwatchBrowser) {
  cleanList(browser);
}

const getReal = 'GetReal course LU 4, activity 4.4';
const tervonen =
  'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
const hansen =
  'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)';

function filterByBoth(browser: NightwatchBrowser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  addWorkspaces(browser);

  filterByCriterion(browser, '2-YEAR SURVIVAL');
  browser.expect.element('#workspace-0').text.to.equal(getReal);
  const firstCriterionFilter = 'svg.MuiSvgIcon-root:nth-child(2)';
  removeFilter(browser, firstCriterionFilter);
  expectAllWorkspaces(browser);

  filterByAlternative(browser, 'placebo');
  browser.expect.element('#workspace-0').text.to.equal(hansen);
  browser.expect.element('#workspace-1').text.to.equal(tervonen);

  filterByCriterion(browser, 'NAUSEA ADRs');
  browser.expect.element('#workspace-0').text.to.equal(tervonen);

  filterByCriterion(browser, '2-year survival');
  browser.waitForElementVisible('#empty-workspace-message');
}

function addWorkspaces(browser: NightwatchBrowser) {
  workspaceService.addExample(browser, getReal);
  workspaceService.addExample(browser, tervonen);
  workspaceService.addExample(browser, hansen);
  expectAllWorkspaces(browser);
}

function expectAllWorkspaces(browser: NightwatchBrowser) {
  browser.expect.element('#workspace-0').text.to.equal(hansen);
  browser.expect.element('#workspace-1').text.to.equal(tervonen);
  browser.expect.element('#workspace-2').text.to.equal(getReal);
}

function filterByCriterion(browser: NightwatchBrowser, criterion: string) {
  browser
    .click('#criterion-filter')
    .setValue('#criterion-filter', criterion)
    .sendKeys('#criterion-filter', browser.Keys.DOWN_ARROW)
    .sendKeys('#criterion-filter', browser.Keys.ENTER);
}

function filterByAlternative(browser: NightwatchBrowser, alternative: string) {
  browser
    .click('#alternative-filter')
    .setValue('#alternative-filter', alternative)
    .sendKeys('#alternative-filter', browser.Keys.DOWN_ARROW)
    .sendKeys('#alternative-filter', browser.Keys.ENTER);
}

function removeFilter(browser: NightwatchBrowser, filterLocation: string) {
  browser.click(filterLocation);
}

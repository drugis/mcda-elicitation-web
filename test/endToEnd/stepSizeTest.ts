import {NightwatchBrowser} from 'nightwatch';
import errorService from './util/errorService';
import loginService from './util/loginService';
import util from './util/util';
import workspaceService from './util/workspaceService';

export = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Set and respect step size for criteria': setStepSizes
};

function beforeEach(browser: NightwatchBrowser) {
  browser.resizeWindow(1366, 728);
  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.uploadTestWorkspace(
    browser,
    '/createSubproblemTestProblem.json'
  );
  util.delayedClick(
    browser,
    '#problem-definition-tab',
    '#effects-table-header'
  );
}

function afterEach(browser: NightwatchBrowser) {
  errorService.isErrorBarNotPresent(browser);
  util.delayedClick(browser, '#logo', '#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function setStepSizes(browser: NightwatchBrowser) {
  setupSubProblem(browser);
  setStepSize(browser, 'crit1Id', 100);
  setStepSize(browser, 'crit2Id', 1);
  browser.click('#add-subproblem-confirm-button');
  setPvfs(browser);

  verifyStepSizesDuringTradeOff(browser);
  verifyStepSizesDuringMatching(browser);
}

function setupSubProblem(browser: NightwatchBrowser) {
  browser
    .waitForElementVisible('#effects-table-header')
    .click('#add-subproblem-button')
    .waitForElementVisible('#add-subproblem-header')
    .waitForElementVisible('#add-subproblem-confirm-button:enabled')
    .waitForElementVisible('#add-subproblem-confirm-button:enabled')
    .click('#inclusion-alt2Id-checkbox')
    .click('#inclusion-deselectionDataSourceId-checkbox')
    .click('#inclusion-deselectionCriterionId-checkbox');
}

function setStepSize(
  browser: NightwatchBrowser,
  criterionId: string,
  stepSize: number
): void {
  browser
    .click(`#step-size-selector-${criterionId}`)
    .click(`#step-size-selector-${criterionId} > option[value='${stepSize}']`);
}

function setPvfs(browser: NightwatchBrowser): void {
  util.delayedClick(
    browser,
    '#preferences-tab',
    '#partial-value-functions-header'
  );
  browser
    .click('#increasing-pvf-button-crit1Id')
    .click('#decreasing-pvf-button-crit2Id');
}

function verifyStepSizesDuringTradeOff(browser: NightwatchBrowser): void {
  browser
    .useXpath()
    .waitForElementVisible('//*[@id="equivalent-change-basis"]')
    .click('//*[@id="equivalent-change-range-type"]')
    .click('//*[@id="reference-slider-from"]')
    .click('//*[@id="equivalent-change-slider"]/span[4]')
    .sendKeys('/html/body/div[2]/div[3]', browser.Keys.ESCAPE)
    .waitForElementNotPresent('//*[@id="equivalent-change-slider"]');

  browser.expect
    .element('//*[@id="reference-slider-from"]')
    .text.to.equal('-100');

  browser
    .click('//*[@id="reference-criterion-selector"]')
    .click('//*[@id="reference-criterion-selector"]/option[@value="crit2Id"]')
    .click('//*[@id="reference-slider-from"]')
    .click('//*[@id="equivalent-change-slider"]/span[4]')
    .sendKeys('/html/body/div[2]/div[3]', browser.Keys.ESCAPE)
    .waitForElementNotPresent('//*[@id="equivalent-change-slider"]');

  browser.expect
    .element('//*[@id="reference-slider-from"]')
    .text.to.equal('-2');

  browser.useCss();
}

function verifyStepSizesDuringMatching(browser: NightwatchBrowser): void {
  browser
    .click('#matching-button')
    .waitForElementVisible('#matching-title-header')
    .click('#criterion-option-crit1Id')
    .click('#next-button')
    .useXpath()
    .waitForElementVisible('//*[@id="matching-statement"]')
    .click('//*[@id="matching-slider"]/span[3]')
    .sendKeys('//*[@id="matching-slider"]/span[3]', browser.Keys.LEFT_ARROW);

  browser.expect.element('//*[@id="matching-cell"]').text.to.equal('100');
  browser.useCss();
}

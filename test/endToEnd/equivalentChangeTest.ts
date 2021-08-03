import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

export = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Equivalent value changes': equivalentValueChangeTest,
  'Equivalent range changes': equivalentRangeChangeTest,
  'Changing reference criterion': changeReferenceCriterion
};

function beforeEach(browser: NightwatchBrowser) {
  browser.resizeWindow(1366, 728);
  const workspaceTitle =
    'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)';

  loginService.login(browser);
  workspaceService.cleanList(browser);
  workspaceService.addExample(browser, workspaceTitle);
  browser.expect.element('#workspace-0').text.to.equal(workspaceTitle);
  browser
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .click('#preferences-tab');
  performEqualSwing(browser);
}

function afterEach(browser) {
  browser.click('#logo').waitForElementVisible('#workspaces-header');
  workspaceService.deleteFromList(browser, 0).end();
}

function equivalentValueChangeTest(browser: NightwatchBrowser) {
  checkEqualValueValues(browser, 50);

  browser
    .click('#reference-slider-by')
    .click('#reference-criterion-slider > span:nth-child(4)') // set to 10
    .sendKeys('.MuiPopover-root > div:nth-child(3)', browser.Keys.ESCAPE) // 3rd child is the actual popover
    .waitForElementNotPresent('.MuiPopover-root');
  checkEqualValueValues(browser, 10);

  browser
    .click('#reference-slider-by')
    .click('#reference-criterion-slider > span:nth-child(11)') // set to 80
    .sendKeys('.MuiPopover-root > div:nth-child(3)', browser.Keys.ESCAPE) // 3rd child is the actual popover
    .waitForElementNotPresent('.MuiPopover-root');
  checkEqualValueValues(browser, 80);
}

function equivalentRangeChangeTest(browser: NightwatchBrowser) {
  browser
    .click('#equivalent-change-range-type')
    .waitForElementVisible('#reference-slider-from');

  checkEqualRangeValues(browser, 50);

  browser
    .click('#reference-slider-from')
    .click('#equivalent-change-slider > span:nth-child(5)') // set to 10
    .sendKeys('.MuiPopover-root > div:nth-child(3)', browser.Keys.ESCAPE) // 3rd child is the actual popover
    .waitForElementNotPresent('.MuiPopover-root');
  checkEqualRangeValues(browser, 35);

  browser
    .click('#reference-slider-to')
    .click('#equivalent-change-slider > span:nth-child(14)') // set to 100
    .sendKeys('.MuiPopover-root > div:nth-child(3)', browser.Keys.ESCAPE) // 3rd child is the actual popover
    .waitForElementNotPresent('.MuiPopover-root');
  checkEqualRangeValues(browser, 10);
}

function checkEqualValueValues(browser: NightwatchBrowser, value: number) {
  browser.expect
    .element('#equivalent-change-Diarrhea')
    .text.to.equal(`${value}`);
  browser.expect
    .element('#equivalent-change-Dizziness')
    .text.to.equal(`${value}`);
  browser.expect
    .element('#equivalent-change-Headache')
    .text.to.equal(`${value}`);
  browser.expect
    .element('#equivalent-change-Insomnia')
    .text.to.equal(`${value}`);
  browser.expect.element('#equivalent-change-Nausea').text.to.equal(`${value}`);
}

function checkEqualRangeValues(browser: NightwatchBrowser, value: number) {
  browser.expect
    .element('#equivalent-change-Diarrhea')
    .text.to.equal(`100 to ${value}`);
  browser.expect
    .element('#equivalent-change-Dizziness')
    .text.to.equal(`100 to ${value}`);
  browser.expect
    .element('#equivalent-change-Headache')
    .text.to.equal(`100 to ${value}`);
  browser.expect
    .element('#equivalent-change-Insomnia')
    .text.to.equal(`100 to ${value}`);
  browser.expect
    .element('#equivalent-change-Nausea')
    .text.to.equal(`100 to ${value}`);
}

function changeReferenceCriterion(browser: NightwatchBrowser) {
  browser
    .waitForElementVisible('#precise-swing-button')
    .assert.containsText('#reference-criterion-selector', 'HAM-D')
    .click('#reference-criterion-selector')
    .click('#reference-criterion-selector > option:nth-child(1)')
    .pause(100) //pause needed to not get 'stale element' error
    .assert.containsText('#reference-criterion-selector', 'Diarrhea');
}

function performEqualSwing(browser: NightwatchBrowser) {
  browser
    .waitForElementVisible('#precise-swing-button')
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#ranking-choice-HAM-D')
    .click('#next-button')
    .click('#save-button')
    .waitForElementVisible('#equivalent-change-basis');
}

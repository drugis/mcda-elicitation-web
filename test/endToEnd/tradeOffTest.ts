import {expect} from 'chai';
import {NightwatchBrowser} from 'nightwatch';
import loginService from './util/loginService';
import workspaceService from './util/workspaceService';

export = {
  'Trade offs': tradeOffTest
};

function tradeOffTest(browser: NightwatchBrowser) {
  const workspaceTitle = '';
  loginService.login(browser);

  workspaceService.cleanList(browser);
  workspaceService.addExample(browser, workspaceTitle);
  browser.expect
    .element('#workspace-0')
    .text.to.equal(workspaceTitle)
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title')
    .click('#preferences-tab')
    .waitForElementVisible('#precise-swing-button')
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#ranking-choice-HAM-D')
    .click('#next-button')
    .click('#save-button')
    .waitForElementVisible('#trade-off-header')
    .expect.element('#trade-off-statement-Diarrhea')
    .text.to.equal('Changing Diarrhea from 100 to 90')
    .expect.element('#trade-off-statement-Dizziness')
    .text.to.equal('Changing Dizziness from 100 to 90')
    .expect.element('#trade-off-statement-Headache')
    .text.to.equal('Changing Heacache from 100 to 90')
    .expect.element('#trade-off-statement-Insomnia')
    .text.to.equal('Changing Insomnia from 100 to 90')
    .expect.element('#trade-off-statement-Nausea')
    .text.to.equal('Changing Nausea from 100 to 90')
    .click('3')
    .useXpath()
    .click('/html/body/div[3]/div[3]/div/div[2]/span/span[3]')
    .useCss()
    .click('#trade-off-header');
}

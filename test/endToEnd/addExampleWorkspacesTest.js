'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

function testExample(browser, title) {
  const testUrl = require('./util/constants').testUrl;
  loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
  workspaceService.addExample(browser, title);
  workspaceService.deleteFromList(browser, title);
  browser.end();
}

module.exports = {
  'Add Antidepressants (Tervonen) example': function(browser) {
    const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';
    testExample(browser, title);
  },

  'Add Antidepressants (Van Valkenhoef) example': function(browser) {
    const title = 'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)';
    testExample(browser, title);
  },

  'Add GetReal course LU 4, activity 4.4 example': function(browser) {
    const title = 'GetReal course LU 4, activity 4.4';
    testExample(browser, title);
  },

  'Add Thrombolytics - single study B/R analysis example': function(browser) {
    const title = 'Thrombolytics - single study B/R analysis';
    testExample(browser, title);
  },

  'Add Zinbryta - initial regulatory review example': function(browser) {
    const title = 'Zinbryta - initial regulatory review';
    testExample(browser, title);
  }
};

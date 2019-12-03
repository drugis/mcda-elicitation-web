'use strict';

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');
const testUrl = require('./util/constants').testUrl;

module.exports = {
  'test': function(browser) {
    const title = 'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)';

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.addExample(browser, title);
    workspaceService.deleteFromList(browser, 0);
    browser.end();
  },
};

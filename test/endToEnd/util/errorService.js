'use strict';

function isErrorBarNotPresent(browser) {
  return browser.assert.not.elementPresent('#error');
}

module.exports = {
  isErrorBarNotPresent: isErrorBarNotPresent
};

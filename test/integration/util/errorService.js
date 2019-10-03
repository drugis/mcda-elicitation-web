'use strict';

const util = require('./util');

function isErrorBarVisible(browser) {
  util.isElementHidden(browser, '/html/body/error-reporting');
}

module.exports = {
  isErrorBarVisible: isErrorBarVisible
};
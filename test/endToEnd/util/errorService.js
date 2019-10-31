'use strict';

const util = require('./util');

function isErrorBarNotPresent(browser) {
  util.isElementNotPresent(browser, '/html/body/error-reporting');
}

function isErrorBarHidden(browser) {
  util.isElementHidden(browser, '/html/body/error-reporting');
}

module.exports = {
  isErrorBarNotPresent: isErrorBarNotPresent,
  isErrorBarHidden: isErrorBarHidden
};
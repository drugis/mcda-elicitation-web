'use strict';

const baseConfig = require('./nightwatch.local.conf');

module.exports = {
  ...baseConfig,
  selenium: {
    ...baseConfig.selenium,
    check_process_delay: 20000
  }
};

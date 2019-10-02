'use strict';

const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');

// we use a nightwatch.conf.js file so we can include comments and helper functions
module.exports = {
  src_folders: [
    'test/integration'// Where you are storing your Nightwatch e2e tests
  ],
  output_folder: './reports', // reports (test outcome) output by nightwatch
  selenium: {
    check_process_delay: 1000,
    start_process: true, // tells nightwatch to start/stop the selenium process
    server_path: seleniumServer.path,
    host: 'localhost',
    port: 4444, // standard selenium port
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
      'webdriver.gecko.driver': geckodriver.path
    }
  },
  test_settings: {
    default: {
      globals: {
        waitForConditionTimeout: 5000 // sometimes internet is slow so wait.
      },
      exclude: ['*/*.js', 'nightwatch.conf.js'],
      desiredCapabilities: {
        browserName: 'firefox',
        // 'moz:firefoxOptions': {
        //   args: ['-headless']
        // },
        javascriptEnabled: true,
        acceptSslCerts: true,
        acceptInsecureCerts: true
      }
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          w3c: false,
          args: [ '--no-sandbox', '--window-size=1366,728']
        },
        javascriptEnabled: true,
        acceptInsecureCerts: true
      }
    }
  }
};

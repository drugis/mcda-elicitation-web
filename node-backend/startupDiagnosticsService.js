'use strict';
const fs = require('fs');
const https = require('https');
const async = require('async');
const _ = require('lodash');
const httpStatus = require('http-status-codes');

module.exports = function(db) {
  function runStartupDiagnostics(callback) {
    async.waterfall([
      checkDBConnection,
      checkPataviConnection
    ], function(error, results) {
      if (error){
        results.push('Could not execute diagnostics, unknown error: ' + error);
      }
      asyncCallback(callback, results);
    });
  }

  function asyncCallback(callback, results) {
    const errors = createErrorArray(results);
    logErrors(errors);
    if (errors.length) {
      callback(createErrorBody(errors));
    } else {
      callback();
    }
  }

  function logErrors(errors) {
    _.forEach(errors, function(message) {
      console.error(message);
    });
  }

  function createErrorArray(results) {
    return _(results)
      .flatten()
      .compact()
      .value();
  }

  function checkDBConnection(callback) {
    db.query('SELECT version() AS postgresql_version',
      [],
      _.partial(dbCheckCallback, callback));
  }

  function dbCheckCallback(callback, error) {
    var startupErrors = [];
    if (error) {
      startupErrors.push('Connection to database unsuccessful. <i>' + error + '</i>.<br> Please make sure the database is running and the environment variables are set correctly.');
    } else {
      console.log('Connection to database successful');
    }
    callback(null, startupErrors);
  }

  function checkPataviConnection(errors, callback) {
    var certificateErrors = getCertificateErrors();
    if (!certificateErrors.length) {
      console.log('All certificates found');
      checkPataviServerConnection(callback, errors);
    } else {
      errors = errors.concat(certificateErrors);
      callback(null, errors);
    }
  }

  function checkPataviServerConnection(callback, errors) {
    var httpsOptions = getHttpsOptions();
    var postRequest = https.request(httpsOptions, _.partial(pataviRequestCallback, callback, errors));
    postRequest.on('error', _.partial(pataviRequestErrorCallback, callback, errors));
    postRequest.end();
  }

  function getHttpsOptions() {
    return {
      hostname: process.env.PATAVI_HOST,
      port: process.env.PATAVI_PORT,
      key: fs.readFileSync(process.env.PATAVI_CLIENT_KEY),
      cert: fs.readFileSync(process.env.PATAVI_CLIENT_CRT),
      ca: fs.readFileSync(process.env.PATAVI_CA)
    };
  }

  function pataviRequestErrorCallback(callback, errors, error) {
    errors.push('Connection to Patavi unsuccessful: <i>' + error + '</i>.<br> Please make sure the Patavi server is running and the environment variables are set correctly.');
    callback(null, errors);
  }

  function pataviRequestCallback(callback, errors, result) {
    if (result.statusCode === httpStatus.OK) {
      console.log('Connection to Patavi server successful');
      callback(null, errors);
    }
  }

  function getCertificateErrors() {
    var errors = [];
    if (!fs.existsSync(process.env.PATAVI_CLIENT_KEY)) {
      errors.push('Patavi client key not found. Please make sure it is accessible at the specified location.');
    }
    if (!fs.existsSync(process.env.PATAVI_CLIENT_CRT)) {
      errors.push('Patavi client certificate not found. Please make sure it is accessible at the specified location.');
    }
    if (!fs.existsSync(process.env.PATAVI_CA)) {
      errors.push('Patavi certificate authority not found. Please make sure it is accessible at the specified location.');
    }
    return errors;
  }

  function createErrorBody(errors) {
    var errorPageHead = '<h3>MCDA could not be started. The following errors occured:</h3>';
    return _.reduce(errors, function(accum, error) {
      return accum.concat('<div style="padding: 10px">' + error + '</div>');
    }, errorPageHead);
  }

  return {
    runStartupDiagnostics: runStartupDiagnostics
  };
};

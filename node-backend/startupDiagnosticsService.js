'use strict';
const fs = require('fs');
const https = require('https');
const async = require('async');
const _ = require('lodash');
const httpStatus = require('http-status-codes');

module.exports = function(db) {
  function runStartupDiagnostics(callback) {
    const asyncCall = async.applyEach([checkDBConnection, checkPataviConnection]);
    asyncCall(_.partial(asyncCallback, callback));
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
      startupErrors.push('Connection to database unsuccessful. ' + error);
      db.endConnection();
      callback(startupErrors);
    } else {
      console.log('Connection to database successful');
      callback();
    }
  }

  function checkPataviConnection(callback) {
    var errors = getCertificateErrors();

    if (!errors.length) {
      console.log('All certificates found');
      checkPataviServerConnection(callback, errors);
    } else {
      callback(errors);
    }
  }

  function checkPataviServerConnection(callback, errors) {
    var httpsOptions = getHttpsOptions();
    var postRequest = https.request(httpsOptions, _.partial(pataviRequestCallback, callback));
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
    errors.push('Connection to Patavi unsuccessful: ' + error);
    callback(errors);
  }

  function pataviRequestCallback(callback, result) {
    if (result.statusCode === httpStatus.OK) {
      console.log('Connection to Patavi server successful');
      callback();
    }
  }

  function getCertificateErrors() {
    var errors = [];
    if (!fs.existsSync(process.env.PATAVI_CLIENT_KEY)) {
      errors.push('Patavi client key not found at: ' + process.env.PATAVI_CLIENT_KEY);
    }
    if (!fs.existsSync(process.env.PATAVI_CLIENT_CRT)) {
      errors.push('Patavi client certificate not found at: ' + process.env.PATAVI_CLIENT_CRT);
    }
    if (!fs.existsSync(process.env.PATAVI_CA)) {
      errors.push('Patavi certificate authority not found at: ' + process.env.PATAVI_CA);
    }
    return errors;
  }

  function createErrorBody(errors) {
    return _.reduce(errors, function(accum, error) {
      return accum.concat('<div>' + error + '</div>');
    }, '');
  }

  return {
    runStartupDiagnostics: runStartupDiagnostics
  };
};

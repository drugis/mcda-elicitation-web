'use strict';
var pg = require('pg');
var async = require('async');
var logger = require('./logger');
var _ = require('lodash');
var pool;

module.exports = function(connectionInfo) {
  pool = !pool ? new pg.Pool(connectionInfo) : pool;

  logger.debug('db pool: ' + JSON.stringify(connectionInfo, null, 2));

  function startTransaction(client, done, callback) {
    logger.debug('START TRANSACTION');
    client.query('START TRANSACTION', function(error) {
      callback(error, client, done);
    });
  }

  function commit(client, done, results, callback) {
    logger.debug('COMMIT');
    client.query('COMMIT', function(error) {
      callback(error, client, done, results);
    });
  }

  function rollback(client, done) {
    logger.debug('ROLLBACK');
    client.query('ROLLBACK', function(error) {
      done(error);
    });
  }

  function runInTransaction(functionsToExecute, callback) {
    pool.connect(function(error, client, done) {
      if (error) {
        logger.error(error);
        callback(error);
      } else {
        async.waterfall(
          [
            async.apply(startTransaction, client, done),
            _.partial(executeFunctions, functionsToExecute),
            commit
          ],
          _.partial(waterfallCallback, callback));
      }
    });
  }

  function executeFunctions(functionsToExecute, client, done, callback) {
    functionsToExecute(client, function(error, result) {
      callback(error, client, done, result);
    });
  }

  function waterfallCallback(callback, error, client, done, result) {
    if (error) {
      logger.error(error);
      rollback(client, done);
      callback(error);
    } else {
      done();
      callback(null, result);
    }
  }

  function query(text, values, callback) {
    logger.debug('db.query; text: ' + text + ' values: ' + values);
    pool.connect(function(error, client, done) {
      if (error) {
        logger.error(error);
        callback(error);
        done();
      } else {
        client.query(text, values, function(error, result) {
          done();
          callback(error, result);
        });
      }
    });
  }
  return {
    // Takes a function work(client, workCallback), where workCallback(error,
    // result). The work will be run in a transaction, and if workCallback is
    // called with an error, the transaction is aborted. Otherwise, the
    // transaction is committed.
    //
    // If the transaction completed, callback(error, result) will be called
    // with the result of work, otherwise with an error.
    runInTransaction: runInTransaction,
    query: query
  };
};

'use strict';
import IError, {Error} from '@shared/interface/IError';
import _ from 'lodash';
import pg from 'pg';
import logger from './logger';
import {waterfall, apply, AsyncResultCallback} from 'async';
let pool: pg.Pool;

export default function DB(connectionInfo: pg.PoolConfig) {
  pool = !pool ? new pg.Pool(connectionInfo) : pool;

  logger.debug('db pool: ' + JSON.stringify(connectionInfo, null, 2));

  function startTransaction(
    client: any,
    done: (release?: any) => void,
    callback: (error: Error, client: any, done: (release?: any) => void) => void
  ) {
    logger.debug('START TRANSACTION');
    client.query('START TRANSACTION', function (error: Error) {
      callback(error, client, done);
    });
  }

  function commit(
    client: any,
    done: (release?: any) => void,
    results: any[],
    callback: (
      error: Error,
      client: any,
      done: (release?: any) => void,
      results: any[]
    ) => void
  ) {
    logger.debug('COMMIT');
    client.query('COMMIT', (error: Error) => {
      callback(error, client, done, results);
    });
  }

  function rollback(client: any, done: (release?: any) => void) {
    logger.debug('ROLLBACK');
    client.query('ROLLBACK', (error: Error) => {
      done(error);
    });
  }

  function runInTransaction(
    functionsToExecute: (
      client: any,
      callback: (error: Error, result?: any) => void
    ) => void,
    callback: AsyncResultCallback<any, IError>
  ) {
    pool.connect((error, client, done) => {
      if (error) {
        logger.error(error);
        callback(error);
      } else {
        waterfall(
          [
            apply(startTransaction, client, done),
            _.partial(executeFunctions, functionsToExecute),
            commit
          ],
          _.partial(waterfallCallback, callback)
        );
      }
    });
  }

  function waterfallCallback(
    callback: (error: Error, result?: any) => void,
    error: Error,
    client?:any,
    done?:any,
    result?: any
  ) {
    if (error) {
      logger.error(error);
      rollback(client, done);
      callback(error);
    } else {
      done();
      callback(null, result);
    }
  }

  function executeFunctions(
    functionsToExecute: (
      client: any,
      callback: (error: Error, result: any) => void
    ) => void,
    client: any,
    done: (release?: any) => void,
    callback: (
      error: Error,
      client: any,
      done: (release?: any) => void,
      result: any
    ) => void
  ) {
    functionsToExecute(client, (error: Error, result: any) => {
      callback(error, client, done, result);
    });
  }

  function query(
    text: string,
    values: any,
    callback: (error: Error, result?: any) => void
  ) {
    logger.debug('db.query; text: ' + text + ' values: ' + values);
    pool.connect(function (error, client, done) {
      if (error) {
        logger.error(error);
        callback(error);
        done();
      } else {
        client.query(text, values, function (error, result) {
          done();
          callback(error, result);
        });
      }
    });
  }

  function endConnection() {
    pool.end();
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
    query: query,
    endConnection: endConnection
  };
}

'use strict';
var logger = require('./logger');
var async = require('async');
module.exports = function(db) {
  function query(req, res, next) {
    logger.debug('GET /workspaces/:id1/subProblem/:id2/scenarios');
    db.query('SELECT id, workspaceId AS "workspaceId", title, definition FROM subProblem WHERE workspaceId = $1', [req.params.workspaceId], function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json(result.rows);
    });
  }

  function get(req, res, next) {
    logger.debug('GET /workspaces/:id/problems/:subProblemId');
    db.query('SELECT id, workspaceId AS "workspaceId", title, definition FROM subProblem WHERE workspaceId = $1 AND id = $2', [
      req.params.workspaceId, req.params.subProblemId
    ], function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json(result.rows[0]);
    });
  }

  function create(req, res, next) {
    logger.debug('POST /workspaces/:workspaceId/problems');

    function subProblemTransaction(client, transactionCallback) {

      function create(callback) {
        logger.debug('creating subproblem');
        client.query('INSERT INTO subProblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id', [req.params.workspaceId, req.body.title, req.body.definition], function(err, result) {
          if (err) {
            logger.debug('error creating subproblem');
            return callback(err);
          }
          logger.debug('done creating subproblem');
          callback(null, req.params.workspaceId, result.rows[0].id);
        });
      }

      function createScenario(workspaceId, subProblemId, callback) {
        logger.debug('creating scenario; workspaceid: ' + workspaceId + ', subProblemId: ' + subProblemId);
        client.query('INSERT INTO scenario (workspace, subProblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id', [workspaceId, subProblemId, 'Default', req.body.scenarioState], function(err) {
          if (err) {
            return callback(err);
          }
          callback(null, subProblemId);
        });
      }

      function retrieveSubProblem(subProblemId, callback) {
        logger.debug('getting subproblem, subProblemId: ' + subProblemId);
        client.query('SELECT * FROM subProblem WHERE id = $1', [subProblemId], function(err, result) {
          if (err) {
            err.status = 500;
            return next(err);
          }
          logger.debug('found subproblem + ' + JSON.stringify(result));
          callback(null, result.rows[0]);
        });
      }

      async.waterfall([
        create,
        createScenario,
        retrieveSubProblem
      ], transactionCallback);
    }

    db.runInTransaction(subProblemTransaction, function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      logger.debug('done creating subProblem : ' + JSON.stringify(result));
      res.json(result);
    });
  }

  function update(req, res, next) {
    logger.debug('UPDATE /workspaces/:id/problems/:subProblemId');
    db.query('UPDATE subProblem SET definition = $1, title = $2 WHERE id = $3', [
      req.body.definition,
      req.body.title,
      req.params.subProblemId
    ], function(err) {
      if (err) {
        err.status = 500;
        next(err);
      }
      res.end();
    });
  }


  return {
    query: query,
    get: get,
    create: create,
    update: update
  };
};

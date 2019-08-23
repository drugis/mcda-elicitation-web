'use strict';
var util = require('./util');
var logger = require('./logger');
var async = require('async');
var _ = require('lodash');

module.exports = function(db) {
  var SubproblemRepository = require('./subProblemRepository')(db);
  var ScenarioRepository = require('./scenarioRepository')(db);

  function query(req, res, next) {
    SubproblemRepository.query(
      req.params.workspaceId,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          res.json(result.rows);
        }
      });
  }

  function get(req, res, next) {
    logger.debug('GET /workspaces/:id/problems/:subProblemId');
    SubproblemRepository.get(
      req.params.workspaceId,
      req.params.subProblemId,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          res.json(result.rows[0]);
        }
      });
  }

  function create(req, res, next) {
    logger.debug('POST /workspaces/:workspaceId/problems');

    function subProblemTransaction(client, transactionCallback) {

      function create(callback) {
        logger.debug('creating subproblem');
        const workspaceId = req.params.workspaceId;
        SubproblemRepository.create(
          workspaceId,
          req.body.title,
          req.body.definition,
          function(error, result) {
            if (error) {
              util.checkForError(error, next);
            } else {
              logger.debug('done creating subproblem');
              const subproblemId = result.rows[0].id;
              callback(workspaceId, subproblemId);
            }
          });
      }

      function createScenario(workspaceId, subproblemId, callback) {
        logger.debug('creating scenario; workspaceid: ' + workspaceId + ', subProblemId: ' + subproblemId);
        var state = req.body.scenarioState;
        ScenarioRepository.create(workspaceId, subproblemId, 'Default', state, _.partial(callback, workspaceId, subproblemId));
      }

      function retrieveSubProblem(workspaceId, subproblemId, callback) {
        SubproblemRepository.get(workspaceId, subproblemId, function(error, result) {
          if (error) {
            util.checkForError(error, next);
          } else {
            callback(result.rows[0]);
          }
        });
      }

      async.waterfall([
        create,
        createScenario,
        retrieveSubProblem
      ], transactionCallback);
    }

    db.runInTransaction(subProblemTransaction, function(error, subproblem) {
      if (error) {
        util.checkForError(error, next);
      } else {
        logger.debug('done creating subProblem : ' + JSON.stringify(subproblem));
        res.json(subproblem);
      }
    });
  }

  function update(req, res, next) {
    logger.debug('UPDATE /workspaces/:id/problems/:subProblemId');
    SubproblemRepository.update(
      req.body.definition,
      req.body.title,
      req.params.subProblemId,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          res.json(result);
        }
      });
  }


  return {
    query: query,
    get: get,
    create: create,
    update: update
  };
};

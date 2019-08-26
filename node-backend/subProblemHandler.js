'use strict';
var util = require('./util');
var logger = require('./logger');
var async = require('async');
var _ = require('lodash');

module.exports = function(db) {
  var SubproblemRepository = require('./subProblemRepository')(db);
  var ScenarioRepository = require('./scenarioRepository')(db);

  function query(request, response, next) {
    SubproblemRepository.query(
      request.params.workspaceId,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          response.json(result.rows);
        }
      });
  }

  function get(request, response, next) {
    logger.debug('GET /workspaces/:id/problems/:subProblemId');
    SubproblemRepository.get(
      request.params.workspaceId,
      request.params.subProblemId,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          response.json(result.rows[0]);
        }
      });
  }

  function create(request, response, next) {
    logger.debug('POST /workspaces/:workspaceId/problems');
    db.runInTransaction(_.partial(subProblemTransaction, request, next), function(error, subproblem) {
      if (error) {
        util.checkForError(error, next);
      } else {
        logger.debug('done creating subProblem : ' + JSON.stringify(subproblem));
        response.json(subproblem);
      }
    });
  }


  function subProblemTransaction(request, next, client, transactionCallback) {
    async.waterfall([
      _.partial(createSubProblem, request, next),
      _.partial(createScenario, request, next),
      _.partial(retrieveSubProblem, next)
    ], transactionCallback);
  }

  function createSubProblem(request, next, callback) {
    logger.debug('creating subproblem');
    const workspaceId = request.params.workspaceId;
    SubproblemRepository.create(
      workspaceId,
      request.body.title,
      request.body.definition,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          logger.debug('done creating subproblem');
          const subproblemId = result.rows[0].id;
          callback(null, workspaceId, subproblemId);
        }
      });
  }

  function createScenario(request, next, workspaceId, subproblemId, callback) {
    logger.debug('creating scenario; workspaceid: ' + workspaceId + ', subProblemId: ' + subproblemId);
    var state = request.body.scenarioState;
    ScenarioRepository.create(workspaceId, subproblemId, 'Default', state, (error) => {
      if (error) {
        util.checkForError(error, next);
      } else {
        callback(null, workspaceId, subproblemId);
      }
    });
  }

  function retrieveSubProblem(next, workspaceId, subproblemId, callback) {
    logger.debug('retrieving subproblem');
    SubproblemRepository.get(workspaceId, subproblemId, function(error, result) {
      if (error) {
        util.checkForError(error, next);
      } else {
        callback(null, result.rows[0]);
      }
    });
  }

  function update(request, response, next) {
    logger.debug('UPDATE /workspaces/:id/problems/:subProblemId');
    SubproblemRepository.update(
      request.body.definition,
      request.body.title,
      request.params.subProblemId,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          response.json(result);
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

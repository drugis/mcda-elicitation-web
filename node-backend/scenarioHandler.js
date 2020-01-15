'use strict';
const httpStatus = require('http-status-codes');
const logger = require('./logger');
const async = require('async');
const util = require('./util');
const _ = require('lodash');

module.exports = function(db) {
  const ScenarioRepository = require('./scenarioRepository')(db);

  function query(request, response, next) {
    ScenarioRepository.query(
      request.params.workspaceId,
      function(error, result) {
        if (error) {
          next(error);
        } else {
          response.json(result.rows);
        }
      });
  }

  function queryForSubProblem(request, response, next) {
    ScenarioRepository.queryForSubProblem(
      request.params.workspaceId,
      request.params.subProblemId,
      function(error, result) {
        if (error) {
          next(error);
        } else {
          response.json(result.rows);
        }
      });
  }

  function get(request, response, next) {
    ScenarioRepository.get(
      request.params.id,
      function(error, result) {
        if (error) {
          next(error);
        } else {
          response.json(result.rows[0]);
        }
      });
  }

  function create(request, response, next) {
    ScenarioRepository.create(
      request.params.workspaceId,
      request.params.subProblemId,
      request.body.title,
      {
        problem: request.body.state.problem,
        prefs: request.body.state.prefs
      },
      function(error, result) {
        if (error) {
          next(error);
        } else {
          response.status(httpStatus.CREATED);
          response.json(result.rows[0]);
        }
      }
    );
  }

  function update(request, response, next) {
    ScenarioRepository.update(
      request.body.state,
      request.body.title,
      request.body.id,
      function(error) {
        if (error) {
          next(error);
        } else {
          response.json(request.body);
        }
      });
  }

  function deleteScenario(request, response, next) {
    const subproblemId = request.params.subproblemId;
    const scenarioId = request.params.id;
    logger.debug('Deleting subproblem ' + subproblemId);
    db.runInTransaction(_.partial(deleteTransaction, subproblemId, scenarioId, next), function(error) {
      if (error) {
        util.handleError(error, next);
      } else {
        logger.debug('done deleting subProblem : ' + JSON.stringify(subproblemId));
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  function deleteTransaction(subproblemId, scenarioId, next, client, transactionCallback) {
    async.waterfall([
      _.partial(blockIfOnlyOneScenario, subproblemId, next),
      _.partial(deleteScenarioAction, scenarioId, next)
    ], transactionCallback);
  }

  function blockIfOnlyOneScenario(subproblemId, next, callback) {
    ScenarioRepository.countScenariosForSubproblem(subproblemId, function(error, result) {
      if (error) {
        util.handleError(error, next);
      } else if (result.rows[0] === 1) {
        util.handleError('Cannot delete the only scenario for subproblem', next);
      } else {
        callback(null);
      }
    });
  }

  function deleteScenarioAction(subproblemId, next, callback) {
    ScenarioRepository.delete(
      subproblemId,
      function(error) {
        if (error) {
          util.handleError(error, next);
        } else {
          callback(null);
        }
      }
    );
  }

  return {
    query: query,
    queryForSubProblem: queryForSubProblem,
    get: get,
    create: create,
    update: update,
    delete: deleteScenario
  };
};

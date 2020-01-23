'use strict';
const httpStatus = require('http-status-codes');
const logger = require('./logger');
const async = require('async');
const util = require('./util');
const _ = require('lodash');

module.exports = function(db) {
  const ScenarioRepository = require('./scenarioRepository')(db);
  const WorkspaceRepository = require('./workspaceRepository')(db);

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
    const workspaceId = request.params.workspaceId;
    logger.debug('Deleting workspace/' + workspaceId + '/problem/' + subproblemId + '/scenario/' + scenarioId);
    db.runInTransaction(_.partial(deleteTransaction, workspaceId, subproblemId, scenarioId), function(error) {
      if (error) {
        util.handleError(error, next);
      } else {
        logger.debug('Done deleting scenario: ' + scenarioId);
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  function deleteTransaction(workspaceId, subproblemId, scenarioId, client, transactionCallback) {
    async.waterfall([
      _.partial(ScenarioRepository.getScenarioIdsForSubproblem, subproblemId),
      _.partial(getDefaultScenario, workspaceId),
      _.partial(setDefaultScenario, workspaceId, scenarioId),
      _.partial(deleteScenarioAction, scenarioId)
    ], transactionCallback);
  }

  function getDefaultScenario(workspaceId, scenarioIds, callback) {
    if (scenarioIds.length === 1) {
      callback('Cannot delete the only scenario for subproblem');
    } else {
      WorkspaceRepository.getDefaultScenarioId(workspaceId, function(error, result) {
        callback(error, result, scenarioIds);
      });
    }
  }

  function setDefaultScenario(workspaceId, scenarioId, defaultScenarioId, scenarioIds, callback) {
    if (defaultScenarioId + '' === scenarioId) {
      const newDefaultScenario = getNewDefaultScenario(scenarioIds, scenarioId);
      WorkspaceRepository.setDefaultScenario(workspaceId, newDefaultScenario, callback);
    } else {
      callback(null, null);
    }
  }
  
  function getNewDefaultScenario(scenarioIds, currentDefaultScenarioId) {
    return _.reject(scenarioIds, ['id', parseInt(currentDefaultScenarioId)])[0].id;
  }
  
  function deleteScenarioAction(scenarioId, setDefaultScenarioResult, callback) {
    ScenarioRepository.delete(scenarioId, callback);
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

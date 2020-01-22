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
    logger.debug('Deleting scenario: ' + scenarioId);
    db.runInTransaction(_.partial(deleteTransaction, workspaceId, subproblemId, scenarioId), function(error) {
      if (error) {
        util.handleError(error, next);
      } else {
        logger.debug('Done deleting scenario: ' + JSON.stringify(scenarioId));
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  function deleteTransaction(workspaceId, subproblemId, scenarioId, client, transactionCallback) {
    async.waterfall([
      _.partial(getScenarioIds, subproblemId),
      _.partial(getDefaultScenario, workspaceId),
      _.partial(setDefaultScenario, workspaceId, scenarioId),
      _.partial(deleteScenarioAction, scenarioId)
    ], transactionCallback);
  }

  function getScenarioIds(subproblemId, callback) {
    ScenarioRepository.getScenarioIdsForSubproblem(subproblemId, callback);
  }

  function getDefaultScenario(workspaceId, scenarioIds, callback) {
    if (scenarioIds && scenarioIds.rows.length === 1) {
      callback('Cannot delete the only scenario for subproblem');
    } else {
      WorkspaceRepository.getDefaultScenario(workspaceId, function(error, result) {
        callback(error, result, scenarioIds.rows);
      });
    }
  }

  function setDefaultScenario(workspaceId, scenarioId, defaultId, scenarioIds, callback) {
    if (defaultId.rows[0].defaultscenarioid + '' === scenarioId) {
      const newDefaultScenario = getNewDefaultScenario(scenarioIds, scenarioId);
      changeDefaultScenarioId(workspaceId, newDefaultScenario, callback);
    } else {
      callback(null, null);
    }
  }
  
  function getNewDefaultScenario(scenarioIds, scenarioId) {
    return _.find(scenarioIds, function(row) {
      return row.id + '' !== scenarioId;
    }).id;
  }

  function changeDefaultScenarioId(workspaceId, scenarioId, callback) {
    WorkspaceRepository.setDefaultScenario(workspaceId, scenarioId, callback);
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

'use strict';
const util = require('./util');
const logger = require('./logger');
const async = require('async');
const _ = require('lodash');
const httpStatus = require('http-status-codes');

module.exports = function(db) {
  var SubproblemRepository = require('./subProblemRepository')(db);
  var ScenarioRepository = require('./scenarioRepository')(db);
  var WorkspaceRepository = require('./workspaceRepository')(db);

  function query(request, response, next) {
    SubproblemRepository.query(
      request.params.workspaceId,
      function(error, result) {
        if (error) {
          util.handleError(error, next);
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
          util.handleError(error, next);
        } else {
          response.json(result.rows[0]);
        }
      });
  }

  function create(request, response, next) {
    logger.debug('POST /workspaces/:workspaceId/problems');
    db.runInTransaction(_.partial(subProblemTransaction, request), function(error, subproblem) {
      if (error) {
        util.handleError(error, next);
      } else {
        logger.debug('done creating subProblem : ' + JSON.stringify(subproblem));
        response.status(httpStatus.CREATED);
        response.json(subproblem);
      }
    });
  }

  function subProblemTransaction(request, client, transactionCallback) {
    async.waterfall([
      _.partial(createSubProblem, request),
      _.partial(createScenario, request),
      _.partial(retrieveSubProblem)
    ], transactionCallback);
  }

  function createSubProblem(request, callback) {
    logger.debug('creating subproblem');
    const workspaceId = request.params.workspaceId;
    SubproblemRepository.create(
      workspaceId,
      request.body.title,
      request.body.definition,
      function(error, result) {
        if (error) {
          callback(error);
        } else {
          logger.debug('done creating subproblem');
          const subproblemId = result.rows[0].id;
          callback(null, workspaceId, subproblemId);
        }
      });
  }

  function createScenario(request, workspaceId, subproblemId, callback) {
    logger.debug('creating scenario; workspaceid: ' + workspaceId + ', subProblemId: ' + subproblemId);
    var state = request.body.scenarioState;
    ScenarioRepository.create(workspaceId, subproblemId, 'Default', state, (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null, workspaceId, subproblemId);
      }
    });
  }

  function retrieveSubProblem(workspaceId, subproblemId, callback) {
    logger.debug('retrieving subproblem');
    SubproblemRepository.get(workspaceId, subproblemId, function(error, result) {
      if (error) {
        callback(error);
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
          util.handleError(error, next);
        } else {
          response.json(result);
        }
      });
  }

  function deleteSubproblem(request, response, next) {
    const subproblemId = request.params.subproblemId;
    const workspaceId = request.params.workspaceId;
    logger.debug('Start deleting subproblem ' + subproblemId);
    db.runInTransaction(_.partial(deleteTransaction, workspaceId, subproblemId), function(error) {
      if (error) {
        util.handleError(error, next);
      } else {
        logger.debug('done deleting subProblem : ' + JSON.stringify(subproblemId));
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  function deleteTransaction(workspaceId, subproblemId, client, transactionCallback) {
    async.waterfall([
      _.partial(getSubproblemIds, workspaceId),
      getDefaultSubproblem,
      _.partial(setDefaultSubproblem, subproblemId),
      _.partial(deleteSubproblemAction, subproblemId)
    ], transactionCallback);
  }

  function getSubproblemIds(workspaceId, callback) {
    SubproblemRepository.getSubproblemIds(workspaceId, function(error, result) {
      if (error) {
        callback(error);
      } else if (result.rows.length === 1) {
        callback('Cannot delete the only subproblem for workspace');
      } else {
        callback(null, workspaceId, result.rows);
      }
    });
  }
  
  function getDefaultSubproblem(workspaceId, subproblemIds, callback) {
    WorkspaceRepository.getDefaultSubproblem(workspaceId, function(error, result) {
      if (error) {
        callback(error);
      } else {
        const currentDefault = result.rows[0].defaultsubproblemid;
        callback(null, workspaceId, subproblemIds, currentDefault);
      }
    });
  }
  
  function setDefaultSubproblem(subproblemId, workspaceId, subproblemIds, defaultId, callback) {
    if (subproblemId+'' === defaultId+'') {
      setNewDefaultSubproblem(subproblemId, workspaceId, subproblemIds, callback);
    } else {
      callback(null);
    }
  }
  
  function setNewDefaultSubproblem(subproblemId, workspaceId, subproblemIds, callback) {
    const newDefault = _.find(subproblemIds, function(row) {
      return (row.id)+'' !== subproblemId;
    }).id;
    WorkspaceRepository.setDefaultSubProblem(workspaceId, newDefault, function(error) {
      if (error) {
        callback(error);
      } else {
        determineAndSetNewDefaultScenario(newDefault, workspaceId, callback);
        
      }
    });
  }
  
  function determineAndSetNewDefaultScenario(subproblemId, workspaceId, callback) {
    ScenarioRepository.getScenarioIdsForSubproblem(subproblemId, function(error, result) {
      if (error) {
        callback(error);
      } else {
        const newDefaultScenario = result.rows[0].id;
        setDefaultScenario(workspaceId, newDefaultScenario, callback);
      }
    });
  }

  function setDefaultScenario(workspaceId, newDefaultScenario, callback) {
    WorkspaceRepository.setDefaultScenario(workspaceId, newDefaultScenario, function(error) {
        callback(error);
    });
  }

  function deleteSubproblemAction(subproblemId, callback) {
    SubproblemRepository.delete(
      subproblemId,
      function(error) {
        callback(error);
      }
    );
  }

  return {
    query: query,
    get: get,
    create: create,
    update: update,
    delete: deleteSubproblem
  };
};

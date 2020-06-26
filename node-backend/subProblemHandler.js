'use strict';
const util = require('./util');
const logger = require('./logger');
const async = require('async');
const _ = require('lodash');
const httpStatus = require('http-status-codes');

module.exports = function (db) {
  var SubproblemRepository = require('./subProblemRepository')(db);
  var ScenarioRepository = require('./scenarioRepository')(db);
  var WorkspaceRepository = require('./workspaceRepository')(db);

  function query(request, response, next) {
    SubproblemRepository.query(request.params.workspaceId, function (
      error,
      result
    ) {
      if (error) {
        util.handleError(error, next);
      } else {
        response.json(result);
      }
    });
  }

  function get(request, response, next) {
    logger.debug('GET /workspaces/:id/problems/:subProblemId');
    SubproblemRepository.get(
      request.params.workspaceId,
      request.params.subProblemId,
      function (error, result) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function create(request, response, next) {
    logger.debug('POST /workspaces/:workspaceId/problems');
    db.runInTransaction(
      _.partial(subProblemTransaction, request),
      _.partialRight(createTransactionCallback, response, next)
    );
  }

  function createTransactionCallback(
    error,
    workspaceId,
    subproblemId,
    response,
    next
  ) {
    if (error) {
      util.handleError(error, next);
    } else {
      retrieveSubProblem(
        workspaceId,
        subproblemId,
        _.partialRight(retrieveSubProblemCallback, response, next)
      );
    }
  }

  function retrieveSubProblemCallback(err, subProblem, response, next) {
    if (err) {
      util.handleError(err, next);
    } else {
      logger.debug('done creating subProblem : ' + JSON.stringify(subProblem));
      response.status(httpStatus.CREATED);
      response.json(subProblem);
    }
  }

  function subProblemTransaction(request, client, transactionCallback) {
    async.waterfall(
      [
        _.partial(createSubProblem, client, request),
        _.partial(createScenario, client, request)
      ],
      transactionCallback
    );
  }

  function createSubProblem(client, request, callback) {
    logger.debug('creating subproblem');
    const workspaceId = request.params.workspaceId;
    SubproblemRepository.createInTransaction(
      client,
      workspaceId,
      request.body.title,
      request.body.definition,
      function (error, result) {
        if (error) {
          callback(error);
        } else {
          logger.debug('done creating subproblem');
          callback(null, workspaceId, result);
        }
      }
    );
  }

  function createScenario(
    client,
    request,
    workspaceId,
    subproblemId,
    callback
  ) {
    logger.debug(
      'creating scenario; workspaceid: ' +
        workspaceId +
        ', subProblemId: ' +
        subproblemId
    );
    var state = request.body.scenarioState;
    ScenarioRepository.createInTransaction(
      client,
      workspaceId,
      subproblemId,
      'Default',
      state,
      (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null, workspaceId, subproblemId);
        }
      }
    );
  }

  function retrieveSubProblem(workspaceId, subproblemId, callback) {
    logger.debug('retrieving subproblem');
    SubproblemRepository.get(workspaceId, subproblemId, function (
      error,
      result
    ) {
      if (error) {
        callback(error);
      } else {
        callback(null, result);
      }
    });
  }

  function update(request, response, next) {
    logger.debug(
      'Updating workspace/' +
        request.params.workspaceId +
        '/problem/' +
        request.params.subproblemId
    );
    SubproblemRepository.update(
      request.body.definition,
      request.body.title,
      request.params.subProblemId,
      function (error, result) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function deleteSubproblem(request, response, next) {
    const subproblemId = request.params.subproblemId;
    const workspaceId = request.params.workspaceId;
    logger.debug(
      'Deleting workspace/' + workspaceId + '/problem/' + subproblemId
    );
    db.runInTransaction(
      _.partial(deleteTransaction, workspaceId, subproblemId),
      function (error) {
        if (error) {
          util.handleError(error, next);
        } else {
          logger.debug('Done deleting subproblem: ' + subproblemId);
          response.sendStatus(httpStatus.OK);
        }
      }
    );
  }

  function deleteTransaction(
    workspaceId,
    subproblemId,
    client,
    transactionCallback
  ) {
    async.waterfall(
      [
        _.partial(getSubproblemIds, workspaceId),
        getDefaultSubproblem,
        _.partial(setDefaultSubproblem, client, subproblemId),
        _.partial(deleteSubproblemAction, client, subproblemId)
      ],
      transactionCallback
    );
  }

  function getSubproblemIds(workspaceId, callback) {
    SubproblemRepository.getSubproblemIds(workspaceId, function (
      error,
      result
    ) {
      if (error) {
        callback(error);
      } else if (result.length === 1) {
        callback('Cannot delete the only subproblem for workspace');
      } else {
        callback(null, workspaceId, result);
      }
    });
  }

  function getDefaultSubproblem(workspaceId, subproblemIds, callback) {
    WorkspaceRepository.getDefaultSubproblem(workspaceId, function (
      error,
      result
    ) {
      if (error) {
        callback(error);
      } else {
        callback(null, workspaceId, subproblemIds, result);
      }
    });
  }

  function setDefaultSubproblem(
    client,
    subproblemId,
    workspaceId,
    subproblemIds,
    defaultId,
    callback
  ) {
    if (subproblemId + '' === defaultId + '') {
      setNewDefaultSubproblem(
        client,
        subproblemId,
        workspaceId,
        subproblemIds,
        callback
      );
    } else {
      callback(null);
    }
  }

  function setNewDefaultSubproblem(
    client,
    subproblemId,
    workspaceId,
    subproblemIds,
    callback
  ) {
    const newDefault = _.find(subproblemIds, function (row) {
      return row.id + '' !== subproblemId;
    }).id;
    WorkspaceRepository.setDefaultSubProblem(
      client,
      workspaceId,
      newDefault,
      function (error) {
        if (error) {
          callback(error);
        } else {
          determineAndSetNewDefaultScenario(newDefault, workspaceId, callback);
        }
      }
    );
  }

  function determineAndSetNewDefaultScenario(
    subproblemId,
    workspaceId,
    callback
  ) {
    ScenarioRepository.getScenarioIdsForSubproblem(subproblemId, function (
      error,
      result
    ) {
      if (error) {
        callback(error);
      } else {
        const newDefaultScenario = result[0];
        setDefaultScenario(workspaceId, newDefaultScenario, callback);
      }
    });
  }

  function setDefaultScenario(workspaceId, newDefaultScenario, callback) {
    WorkspaceRepository.setDefaultScenario(
      workspaceId,
      newDefaultScenario,
      function (error) {
        callback(error);
      }
    );
  }

  function deleteSubproblemAction(client, subproblemId, callback) {
    SubproblemRepository.delete(client, subproblemId, function (error) {
      callback(error);
    });
  }

  return {
    query: query,
    get: get,
    create: create,
    update: update,
    delete: deleteSubproblem
  };
};

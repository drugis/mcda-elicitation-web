'use strict';
var util = require('./util');
var logger = require('./logger');
var async = require('async');
var httpStatus = require('http-status-codes');
var _ = require('lodash');

module.exports = function (db) {
  var WorkspaceRepository = require('./workspaceRepository')(db);
  var SubProblemRepository = require('./subProblemRepository')(db);
  var ScenarioRepository = require('./scenarioRepository')(db);

  function query(request, response, next) {
    WorkspaceRepository.query(util.getUser(request).id, function (
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

  function create(request, response, next) {
    db.runInTransaction(
      _.partial(createWorkspaceTransaction, request),
      function (error, result) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.status(httpStatus.CREATED);
          response.json(result);
        }
      }
    );
  }

  function createWorkspaceTransaction(request, client, transactionCallback) {
    async.waterfall(
      [
        _.partial(createNewWorkspace, client),
        _.partial(createSubProblem, client),
        _.partial(setDefaultSubProblem, client),
        _.partial(createScenario, client),
        _.partial(setDefaultScenario, client),
        _.partial(WorkspaceRepository.getWorkspaceInfo, client)
      ],
      transactionCallback
    );

    function createNewWorkspace(client, callback) {
      logger.debug('creating new workspace');

      var owner = util.getUser(request).id;
      var title = request.body.title;
      var problem = request.body.problem;
      WorkspaceRepository.create(client, owner, title, problem, callback);
    }

    function createSubProblem(client, result, callback) {
      logger.debug('creating subProblem');

      var definition = {
        ranges: util.getRanges(request.body.problem)
      };
      const workspaceId = result;
      SubProblemRepository.create(
        client,
        workspaceId,
        'Default',
        definition,
        function (error, result) {
          if (error) {
            callback(error);
          } else {
            const subproblemId = result;
            callback(null, workspaceId, subproblemId);
          }
        }
      );
      logger.debug('created definition ' + JSON.stringify(definition));
    }

    function setDefaultSubProblem(client, workspaceId, subproblemId, callback) {
      logger.debug('setting default subProblem');
      WorkspaceRepository.setDefaultSubProblem(
        client,
        workspaceId,
        subproblemId,
        function (error) {
          if (error) {
            callback(error);
          } else {
            callback(null, workspaceId, subproblemId);
          }
        }
      );
    }

    function createScenario(client, workspaceId, subproblemId, callback) {
      logger.debug('creating scenario');
      var state = {
        problem: util.reduceProblem(request.body.problem)
      };
      ScenarioRepository.createInTransaction(
        client,
        workspaceId,
        subproblemId,
        'Default',
        state,
        function (error, result) {
          if (error) {
            callback(error);
          } else {
            const scenarioId = result.id;
            callback(null, workspaceId, scenarioId);
          }
        }
      );
    }

    function setDefaultScenario(client, workspaceId, scenarioId, callback) {
      logger.debug('setting default scenario');
      WorkspaceRepository.setDefaultScenario(
        client,
        workspaceId,
        scenarioId,
        function (error) {
          if (error) {
            callback(error);
          } else {
            callback(null, workspaceId);
          }
        }
      );
    }
  }

  function get(request, response, next) {
    WorkspaceRepository.get(request.params.id, function (error, result) {
      if (error) {
        util.handleError(error, next);
      } else {
        response.json(result);
      }
    });
  }

  function update(request, response, next) {
    WorkspaceRepository.update(
      request.body.problem.title,
      request.body.problem,
      request.params.id,
      function (error) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.sendStatus(httpStatus.OK);
        }
      }
    );
  }

  function del(request, response, next) {
    WorkspaceRepository.delete(request.params.id, function (error) {
      if (error) {
        util.handleError(error, next);
      } else {
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  return {
    query: query,
    create: create,
    createWorkspaceTransaction: createWorkspaceTransaction,
    get: get,
    update: update,
    delete: del
  };
};

'use strict';
var util = require('./util');
var logger = require('./logger');
var async = require('async');

module.exports = function(db) {
  var workspaceRepository = require('./workspaceRepository')(db);
  var subProblemRepository = require('./subProblemRepository')(db);
  var scenarioRepository = require('./scenarioRepository')(db);

  // Complete workspaces
  function query(request, response, next) {
    workspaceRepository.query(util.getUser(request).id, function(error, result) {
      util.checkForError(error, next);
      if (!error) {
        response.json(result.rows);
      }
    });
  }

  function create(request, response, next) {
    function workspaceTransaction(client, transactionCallback) {
      function createNewWorkspace(callback) {
        var owner = util.getUser(request).id;
        var title = request.body.title;
        var problem = request.body.problem;
        workspaceRepository.create(owner, title, problem, callback);
      }

      function createSubProblem(workspaceId, callback) {
        var definition = {
          ranges: util.getRanges(request.body.problem)
        };
        subProblemRepository.create(workspaceId, definition, callback);
        logger.debug('created definition ' + JSON.stringify(definition));
      }

      function createScenario(workspaceId, subProblemId, callback) {
        var state = {
          problem: util.reduceProblem(request.body.problem)
        };
        scenarioRepository.create(workspaceId, subProblemId, state, callback);
      }

      async.waterfall([
        createNewWorkspace,
        createSubProblem,
        workspaceRepository.setDefaultSubProblem,
        createScenario,
        workspaceRepository.setDefaultScenario,
        workspaceRepository.getWorkspaceInfo
      ], transactionCallback);
    }

    db.runInTransaction(workspaceTransaction, function(error, result) {
      util.checkForError(error, next);
      if (!error) {
        response.json(result);
      }
    });
  }

  function get(req, response, next) {
    workspaceRepository.get(req.params.id, function(error, result) {
      util.checkForError(error, next);
      if (!error) {
        response.json(result);
      }
    });
  }

  function update(req, response, next) {
    workspaceRepository.update(
      req.body.problem.title,
      req.body.problem,
      req.params.id,
      function(error) {
        util.checkForError(error, next);
        if (!error) {
          response.end();
        }
      });
  }

  function del(req, response, next) {
    workspaceRepository.delete(req.params.id, function(error) {
      util.checkForError(error, next);
      if (!error) {
        response.end();
      }
    });
  }

  return {
    query: query,
    create: create,
    get: get,
    update: update,
    delete: del
  };
};

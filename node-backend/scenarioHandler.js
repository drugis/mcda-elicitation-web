'use strict';
var httpStatus = require('http-status-codes');

module.exports = function(db) {
  var ScenarioRepository = require('./scenarioRepository')(db);

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
          response.sendStatus(httpStatus.OK);
        }
      });
  }

  return {
    query: query,
    queryForSubProblem: queryForSubProblem,
    get: get,
    create: create,
    update: update
  };
};

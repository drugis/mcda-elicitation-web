'use strict';

module.exports = function(db) {
  var ScenarioRepository = require('./scenarioRepository')(db);

  function query(req, res, next) {
    ScenarioRepository.query(
      req.params.workspaceId,
      function(error, result) {
        if (error) {
          next(error);
        } else {
          res.json(result.rows);
        }
      });
  }

  function queryForSubProblem(req, res, next) {
    ScenarioRepository.queryForSubProblem(
      req.params.workspaceId,
      req.params.subProblemId,
      function(error, result) {
        if (error) {
          next(error);
        } else {
          res.json(result.rows);
        }
      });
  }

  function get(req, res, next) {
    ScenarioRepository.get(
      req.params.id,
      function(error, result) {
        if (error) {
          next(error);
        } else {
          res.json(result.rows[0]);
        }
      });
  }

  function create(req, res, next) {
    ScenarioRepository.create(
      req.params.workspaceId,
      req.params.subProblemId,
      req.body.title,
      {
        problem: req.body.state.problem,
        prefs: req.body.state.prefs
      },
      function(error, result) {
        if (error) {
          next(error);
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  }

  function update(req, res, next) {
    ScenarioRepository.update(
      req.body.state,
      req.body.title,
      req.body.id,
      function(error) {
        if (error) {
          next(error);
        } else {
          res.end();
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

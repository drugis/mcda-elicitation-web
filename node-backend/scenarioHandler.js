'use strict';

var logger = require('./logger');

module.exports = function(db) {

  function query(req, res, next) {
    logger.debug('GET /workspaces/scenarios');
    db.query('SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1', [req.params.workspaceId], function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json(result.rows);
    });
  }

  function queryScenariosForSubProblem(req, res, next) {
    logger.debug('GET /workspaces/:id1/subProblem/:id2/scenarios');
    db.query('SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1 AND subProblemId = $2', [req.params.workspaceId, req.params.subProblemId], function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json(result.rows);
    });
  }

  function get(req, res, next) {
    logger.debug('GET /workspaces/:id/scenarios/:id');
    db.query('SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE id = $1', [req.params.id], function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json(result.rows[0]);
    });
  }

  function create(req, res, next) {
  db.query('INSERT INTO scenario (workspace, subProblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id', [req.params.workspaceId, req.params.subProblemId, req.body.title, {
    problem: req.body.state.problem,
    prefs: req.body.state.prefs
  }], function(err, result) {
    if (err) {
      err.status = 500;
      next(err);
    }
    res.json(result.rows[0]);
  });
}

function update(req, res, next) {
  logger.debug('updating scenario :id');
  db.query('UPDATE scenario SET state = $1, title = $2 WHERE id = $3', [{
      problem: req.body.state.problem,
      prefs: req.body.state.prefs,
      legend: req.body.state.legend
    },
    req.body.title, req.body.id
  ], function(err) {
    if (err) {
      err.status = 500;
      next(err);
    }
    res.end();
  });
}

  return {
    query: query,
    queryScenariosForSubProblem: queryScenariosForSubProblem,
    get: get,
    create: create,
    update: update
  };
};

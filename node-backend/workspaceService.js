'use strict';
var util = require('./util');
var logger = require('./logger');
var async = require('async');

module.exports = function(db) {
  var workspaceRepository = require('./workspaceRepository')(db);
  var subProblemRepository = require('./subProblemRepository')(db);

  function checkForError(err, next) {
    if (err) {
      logger.error(JSON.stringify(err, null, 2));
      err.status = 500;
      next({
        statusCode: 500,
        message: err
      });
    }
  }

  function createInProgress(req, res, next) {
    logger.debug('creating in-progress workspace');

    db.query('INSERT INTO inProgressWorkspace (owner, state) VALUES ($1, $2) RETURNING id', [getUser(req).id, req.body], function(err, result) {
      checkForError(err, next);
      res.json({ id: result.rows[0].id });
    });
  }

  function updateInProgress(req, res, next) {
    logger.debug('updating in-progress workspace');
    db.query('UPDATE inProgressWorkspace SET state = $1 WHERE id = $2 ', [req.body, req.params.id], function(err) {
      checkForError(err, next);
      res.end();
    });
  }

  function getInProgress(req, res, next) {
    logger.debug('GET /inProgress/:id');
    db.query('SELECT id, owner, state FROM inProgressWorkspace WHERE id = $1', [req.params.id], function(err, result) {
      checkForError(err, next);
      res.json(result.rows[0]);
    });
  }

  function queryInProgress(req, res, next) {
    logger.debug('GET /inProgress/');
    db.query('SELECT id, owner, state FROM inProgressWorkspace WHERE owner = $1', [getUser(req).id], function(err, result) {
      checkForError(err, next);
      res.json(result.rows);
    });
  }

  function deleteInProgress(req, res, next) {
    db.query('DELETE FROM inProgressWorkspace WHERE id=$1', [req.params.id], function(err) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.end();
    });
  }

  // Complete workspaces
  function queryWorkspaces(req, res, next) {
    logger.debug('GET /workspaces');
    db.query('SELECT id, owner, title, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM Workspace WHERE owner = $1', [getUser(req).id], function(err, result) {
      checkForError(err, next);
      res.json(result.rows);
    });
  }

  function createWorkspace(request, res, next) {
    logger.debug('create workspace');

    function workspaceTransaction(client, callback) {
      function createNewWorkspace() {
        var owner = getUser(request).id;
        var title = request.body.title;
        var problem = request.body.problem;
        workspaceRepository.create(owner, title, problem, callback);
      }

      function createSubProblem(workspaceId, callback) {
        logger.debug('creating subproblem');
        var definition = {
          ranges: util.getRanges(request.body.problem)
        };
        subProblemRepository.create(workspaceId, definition, callback);
        logger.debug('created definition ' + JSON.stringify(definition));

      }

      function setDefaultSubProblem(workspaceId, subProblemId, callback) {
        workspaceRepository.setDefaultSubProblem(workspaceId, subProblemId, callback);
      }

      function createScenario(workspaceId, subProblemId, callback) {
        var state = {
          problem: util.reduceProblem(request.body.problem)
        };
        logger.debug('creating scenario');
        client.query('INSERT INTO scenario (workspace, subproblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id',
          [workspaceId, subProblemId, 'Default', state],
          function(err, result) {
            if (err) {
              return callback(err);
            }
            callback(null, workspaceId, result.rows[0].id);
          });
      }

      function setDefaultScenario(workspaceId, scenarioId, callback) {
        workspaceRepository.setDefaultScenario(workspaceId, scenarioId, callback);
      }

      function getWorkspaceInfo(workspaceId, callback) {
        logger.debug('getting workspace info');
        client.query('SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1', [workspaceId], function(err, result) {
          if (err) {
            return callback(err);
          }
          callback(null, result.rows[0]);
        });
      }

      async.waterfall([
        createNewWorkspace,
        createSubProblem,
        setDefaultSubProblem,
        createScenario,
        setDefaultScenario,
        getWorkspaceInfo
      ], callback);
    }

    db.runInTransaction(workspaceTransaction, function(err, result) {
      checkForError(err, next);
      res.json(result);
    });
  }

  function getWorkspace(req, res, next) {
    logger.debug('GET /workspaces/:id');
    workspaceRepository.get(req.params.id, function(error, result) {
      checkForError(error, next);
      res.json(result);
    });
  }

  function updateWorkspace(req, res, next) {
    db.query('UPDATE workspace SET title = $1, problem = $2 WHERE id = $3 ', [req.body.problem.title, req.body.problem, req.params.id], function(err) {
      checkForError(err, next);
      res.end();
    });
  }

  function deleteWorkspace(req, res, next) {
    logger.debug('DELETE /workspaces/:id');

    function deleteEverything(client, callback) {
      function deleteSubproblems(callback) {
        client.query('DELETE FROM subproblem WHERE workspaceid=$1', [req.params.id], function(err) {
          if (err) {
            logger.error('error deleting subproblem');
            return callback(err);
          }
          logger.debug('done deleting subproblem');
          callback(null, req.params.id);
        });
      }

      function deleteScenarios() {
        client.query('DELETE FROM scenario WHERE workspace=$1', [req.params.id], function(err) {
          if (err) {
            logger.error('error deleting scenario');
            return callback(err);
          }
          logger.debug('done deleting scenario');
          callback(null, req.params.id);
        });
      }

      function deleteWorkspaceRemnants() {
        client.query('DELETE FROM scenario WHERE workspace=$1;DELETE FROM workspace WHERE id=$1', [req.params.id], function(err) {
          if (err) {
            logger.error('error deleting workspace');
            return callback(err);
          }
          logger.debug('done deleting workspace');
          callback(null, req.params.id);
        });
      }
      async.waterfall([
        deleteSubproblems,
        deleteScenarios,
        deleteWorkspaceRemnants
      ], callback);
    }

    db.runInTransaction(deleteEverything, function(err, result) {
      checkForError(err, next);
      res.json(result);
    });

  }

  function getUser(req) {
    if (req.user) {
      return req.user;
    }
    if (req.session.user) {
      return req.session.user;
    }
  }

  return {
    createInProgress: createInProgress,
    updateInProgress: updateInProgress,
    getInProgress: getInProgress,
    queryInProgress: queryInProgress,
    deleteInProgress: deleteInProgress,

    queryWorkspaces: queryWorkspaces,
    createWorkspace: createWorkspace,
    getWorkspace: getWorkspace,
    updateWorkspace: updateWorkspace,
    deleteWorkspace: deleteWorkspace
  };
};

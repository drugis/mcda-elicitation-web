'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function create(workspaceId, subproblemId, title, state, callback) {
    logger.debug('creating scenario');
    const query = 'INSERT INTO scenario (workspace, subProblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id';
    db.query(query,
      [workspaceId, subproblemId, title, state],
      callback
    );
  }


  function query(workspaceId, callback) {
    logger.debug('GET /workspaces/scenarios');
    const query = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1';
    db.query(
      query,
      [workspaceId],
      callback
    );
  }

  function queryForSubProblem(workspaceId, subproblemId, callback) {
    logger.debug('GET /workspaces/:id1/subProblem/:id2/scenarios');
    const query = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1 AND subProblemId = $2';
    db.query(
      query,
      [workspaceId, subproblemId],
      callback);
  }

  function get(scenarioId, callback) {
    logger.debug('GET /workspaces/:id/scenarios/:id');
    const query = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE id = $1';
    db.query(
      query,
      [scenarioId],
      callback
    );
  }

  function update(state, title, scenarioId, callback) {
    logger.debug('updating scenario :id');
    const query = 'UPDATE scenario SET state = $1, title = $2 WHERE id = $3';
    db.query(
      query,
      [{
        problem: state.problem,
        prefs: state.prefs,
        legend: state.legend,
        uncertaintyOptions: state.uncertaintyOptions
      },
        title,
        scenarioId
      ],
      callback
    );
  }

  function deleteScenario(subproblemId, callback) {
    const query = 'DELETE FROM scenario WHERE id = $1';
    db.query(
      query,
      [subproblemId],
      callback
    );
  }

  function countScenariosForSubproblem(subproblemId, callback) {
    const query = 'SELECT COUNT(*) FROM scenario WHERE subproblemid = $1';
    db.query(
      query,
      [subproblemId],
      callback
    );
  }
  return {
    create: create,
    query: query,
    queryForSubProblem: queryForSubProblem,
    get: get,
    update: update,
    delete: deleteScenario,
    countScenariosForSubproblem: countScenariosForSubproblem
  };
};

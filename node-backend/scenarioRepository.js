'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function create(workspaceId, subProblemId, state, callback) {
    logger.debug('creating scenario');
    const query = 'INSERT INTO scenario (workspace, subproblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id';
    db.query(query,
      [workspaceId, subProblemId, 'Default', state],
      function(err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, workspaceId, result.rows[0].id);
        }
      });
  }


  return {
    create: create
  };
};

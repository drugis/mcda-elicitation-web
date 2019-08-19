'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function create(workspaceId, definition, callback) {
    logger.debug('creating subproblem');
    const query = 'INSERT INTO subProblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id';
    db.query(query,
      [workspaceId, 'Default', definition],
      function(err, result) {
        if (err) {
          logger.error('error creating subproblem');
          callback(err);
        } else {
          logger.debug('done creating subproblem');
          callback(null, workspaceId, result.rows[0].id);
        }
      });
  }

  return {
    create: create
  };
};

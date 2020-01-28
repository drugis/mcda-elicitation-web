'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('getting in progress workspace: ' + workspaceId);
    const query = 'SELECT id, owner, state FROM inProgressWorkspace WHERE id = $1';
    db.query(query,
      [workspaceId],
      function(error, result) {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback({
            message: 'In progress workspace with ID ' + workspaceId + ' not found.',
            statusCode: 404
          });
        } else {
          callback(null, result.rows[0]);
        }
      });
  }

  function create(ownerId, state, callback) {
    logger.debug('creating in-progress workspace');
    const query = 'INSERT INTO inProgressWorkspace (owner, state) VALUES ($1, $2) RETURNING id';
    db.query(query,
      [ownerId, state],
      function(error, result) {
        callback(error, error || result.rows[0]);
      });
  }

  function update(state, workspaceId, callback) {
    logger.debug('updating in-progress workspace');
    const query = 'UPDATE inProgressWorkspace SET state = $1 WHERE id = $2';
    db.query(query,
      [state, workspaceId],
      callback);
  }

  function query(ownerId, callback) {
    logger.debug('getting in progress workspaces');
    const query = 'SELECT id, owner, state FROM inProgressWorkspace WHERE owner = $1';
    db.query(query,
      [ownerId],
      function(error, result) {
        callback(error, error || result.rows);
      });
  }

  function del(workspaceId, callback) {
    logger.debug('delete in-progress workspace');
    const query = 'DELETE FROM inProgressWorkspace WHERE id=$1';
    db.query(query,
      [workspaceId],
      callback);
  }

  return {
    get: get,
    create: create,
    update: update,
    query: query,
    delete: del
  };
};

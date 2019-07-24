'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /inProgress/:id');
    const query = 'SELECT id, owner, state FROM inProgressWorkspace WHERE id = $1';
    db.query(query,
      [workspaceId],
      callback);
  }

  function create(ownerId, state, callback) {
    logger.debug('creating in-progress workspace');
    const query = 'INSERT INTO inProgressWorkspace (owner, state) VALUES ($1, $2) RETURNING id';
    db.query(query,
      [ownerId, state],
      callback);
  }

  function update(state, workspaceId, callback) {
    logger.debug('updating in-progress workspace');
    const query = 'UPDATE inProgressWorkspace SET state = $1 WHERE id = $2';
    db.query(query,
      [state, workspaceId],
      callback);
  }

  function query(ownerId, callback) {
    logger.debug('GET /inProgress/');
    const query = 'SELECT id, owner, state FROM inProgressWorkspace WHERE owner = $1';
    db.query(query,
      [ownerId],
      callback);
  }

  function del(ownerId, callback) {
    logger.debug('delete in-progress workspace');
    const query = 'DELETE FROM inProgressWorkspace WHERE id=$1';
    db.query(query,
      [ownerId],
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

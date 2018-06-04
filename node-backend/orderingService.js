'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function getOrdering(req, res, next) {
    logger.debug('GET /workspaces/' + req.params.workspaceId + '/ordering');
    db.query('SELECT workspaceId AS "workspaceId", ordering FROM ordering WHERE workspaceId = $1', [req.params.workspaceId], function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json({
        ordering: result.rows[0] ? result.rows[0].ordering : undefined
      });
    });
  }

  function updateOrdering(req, res, next) {
    logger.debug('SET /workspaces/' + req.params.workspaceId + '/ordering/');
    db.query('insert into ordering(workspaceId, ordering) values($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET ordering=$2', [
      req.params.workspaceId,
      req.body
    ], function(err) {
      if (err) {
        err.status = 500;
        next(err);
      }
      res.end();
    });
  }
  return {
    getOrdering: getOrdering,
    updateOrdering: updateOrdering
  };
};

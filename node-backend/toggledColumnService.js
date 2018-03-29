'use strict';
var logger = require('./logger');
module.exports = function(db) {

  function getToggledColumns(req, res, next) {
    logger.debug('GET /workspaces/' + req.params.workspaceId + '/toggledColumns');
    db.query('SELECT toggledColumns AS "toggledColumns", toggledColumns FROM toggledColumns WHERE workspaceId = $1', [req.params.workspaceId], function(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json({
        toggledColumns: result.rows[0] ? result.rows[0].toggledColumns : undefined
      });
    });
  }

  function updateToggledColumns(req, res, next) {
    logger.debug('POST /workspaces/' + req.params.workspaceId + '/toggledColumns');
    db.query('INSERT INTO toggledColumns (workspaceid, toggledColumns) VALUES ($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET toggledColumns=$2', [req.params.workspaceId, req.body.toggledColumns], function(err) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.end();
    });
  }

  return {
    getToggledColumns: getToggledColumns,
    updateToggledColumns: updateToggledColumns
  }

}
'use strict';
var express = require('express');

module.exports = function(db) {
  var OrderingHandler = require('./orderingHandler')(db);
  return express.Router()
    .get('/:workspaceId/ordering/', OrderingHandler.get)
    .put('/:workspaceId/ordering/', OrderingHandler.update)
    ;
};

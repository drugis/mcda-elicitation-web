'use strict';
var express = require('express');

module.exports = function(db) {
  var OrderingService = require('./orderingService')(db);
  return express.Router()
    .get('/', OrderingService.getOrdering)
    .put('/', OrderingService.updateOrdering)
    ;
};

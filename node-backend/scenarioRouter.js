'use strict';
var express = require('express');

module.exports = function(db) {
  var ScenarioHandler = require('./scenarioHandler')(db);
  return express.Router()
    .get('/:workspaceId/scenarios', ScenarioHandler.query)
    .get('/:workspaceId/problems/:subProblemId/scenarios', ScenarioHandler.queryForSubProblem)
    .get('/:workspaceId/problems/:subProblemId/scenarios/:id', ScenarioHandler.get)
    .post('/:workspaceId/problems/:subProblemId/scenarios', ScenarioHandler.create)
    .post('/:workspaceId/problems/:subProblemId/scenarios/:id', ScenarioHandler.update)
    ;
};

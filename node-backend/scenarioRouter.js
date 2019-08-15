'use strict';
var express = require('express');

module.exports = function(db) {
  var ScenarioService = require('./scenarioService')(db);
  return express.Router()
    .get('/scenarios', ScenarioService.queryScenarios)
    .get('/problems/:subProblemId/scenarios', ScenarioService.queryScenariosForSubProblem)
    .get('/problems/:subProblemId/scenarios/:id', ScenarioService.getScenario)
    .post('/problems/:subProblemId/scenarios', ScenarioService.createScenario)
    .post('/problems/:subProblemId/scenarios/:id', ScenarioService.updateScenario)
    ;
};

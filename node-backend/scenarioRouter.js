'use strict';
var express = require('express');

module.exports = function(db) {
  var ScenarioService = require('./scenarioService')(db);
  return express.Router()
    .get('/scenarios', ScenarioService.query)
    .get('/problems/:subProblemId/scenarios', ScenarioService.queryScenariosForSubProblem)
    .get('/problems/:subProblemId/scenarios/:id', ScenarioService.get)
    .post('/problems/:subProblemId/scenarios', ScenarioService.create)
    .post('/problems/:subProblemId/scenarios/:id', ScenarioService.update)
    ;
};

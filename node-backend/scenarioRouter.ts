'use strict';
import express from 'express';
import ScenarioHandler from './scenarioHandler';

export default function ScenarioRouter(db: any) {
  const {
    query,
    queryForSubProblem,
    get,
    create,
    update,
    delete: del
  } = ScenarioHandler(db);
  return express
    .Router()
    .get('/:workspaceId/scenarios', query)
    .get('/:workspaceId/problems/:subproblemId/scenarios', queryForSubProblem)
    .get('/:workspaceId/problems/:subproblemId/scenarios/:id', get)
    .post('/:workspaceId/problems/:subproblemId/scenarios', create)
    .post('/:workspaceId/problems/:subproblemId/scenarios/:id', update)
    .delete('/:workspaceId/problems/:subproblemId/scenarios/:id', del);
}

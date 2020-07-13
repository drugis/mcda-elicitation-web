import {Router} from 'express';
import ScenarioHandler from './scenarioHandler';
import IDB from './interface/IDB';

export default function ScenarioRouter(db: IDB) {
  const {
    query,
    queryForSubProblem,
    get,
    create,
    update,
    delete: del
  } = ScenarioHandler(db);
  return Router()
    .get('/:workspaceId/scenarios', query)
    .get('/:workspaceId/problems/:subproblemId/scenarios', queryForSubProblem)
    .get('/:workspaceId/problems/:subproblemId/scenarios/:id', get)
    .post('/:workspaceId/problems/:subproblemId/scenarios', create)
    .post('/:workspaceId/problems/:subproblemId/scenarios/:id', update)
    .delete('/:workspaceId/problems/:subproblemId/scenarios/:id', del);
}

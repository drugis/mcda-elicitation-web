import {Router} from 'express';
import IDB from './interface/IDB';
import WorkspaceHandler from './workspaceHandler';

export default function WorkspaceRouter(db: IDB) {
  const workspaceHandler = WorkspaceHandler(db);
  const {
    query,
    create,
    createPremade,
    get,
    update,
    delete: del
  } = workspaceHandler;

  return Router()
    .get('/', query)
    .post('/', create)
    .post('/createPremade', createPremade)
    .get('/:id', get)
    .post('/:id', update)
    .delete('/:id', del);
}

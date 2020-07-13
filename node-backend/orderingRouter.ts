import OrderingHandler from './orderingHandler';
import {Router} from 'express';
import IDB from './interface/IDB';

export default function OrderingRouter(db: IDB) {
  const {get, update} = OrderingHandler(db);
  return Router()
    .get('/:workspaceId/ordering/', get)
    .put('/:workspaceId/ordering/', update);
}

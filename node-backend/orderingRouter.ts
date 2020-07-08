'use strict';
import OrderingHandler from './orderingHandler';
import {Router} from 'express';
import IDB from './interface/IDB';

export default function OrderingRouter(db: IDB) {
  const orderingHandler = OrderingHandler(db);
  return Router()
    .get('/:workspaceId/ordering/', orderingHandler.get)
    .put('/:workspaceId/ordering/', orderingHandler.update);
}

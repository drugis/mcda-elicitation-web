'use strict';
import WorkspaceHandler from './workspaceHandler';
import {Router} from 'express';
import IDB from './interface/IDB';

export default function WorkspaceRouter(db: IDB) {
  const workspaceHandler = WorkspaceHandler(db);
  const {query, create, get, update, delete: del} = workspaceHandler;

  return Router()
    .get('/', query)
    .post('/', create)
    .get('/:id', get)
    .post('/:id', update)
    .delete('/:id', del);
}

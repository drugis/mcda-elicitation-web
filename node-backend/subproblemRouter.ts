'use strict';
import {Router} from 'express';
import SubproblemHandler from './subproblemHandler';
import IDB from './interface/IDB';

export default function SubproblemRouter(db: IDB) {
  const {query, get, create, update, delete: del} = SubproblemHandler(db);
  return Router()
    .get('/:workspaceId/problems/', query)
    .get('/:workspaceId/problems/:subproblemId', get)
    .post('/:workspaceId/problems/', create)
    .post('/:workspaceId/problems/:subproblemId', update)
    .delete('/:workspaceId/problems/:subproblemId', del);
}

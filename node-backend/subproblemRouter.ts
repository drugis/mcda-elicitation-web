'use strict';
import express from 'express';
import SubproblemHandler from './subproblemHandler';

export default function SubproblemRouter(db: any) {
  const {query, get, create, update, delete: del} = SubproblemHandler(db);
  return express
    .Router()
    .get('/:workspaceId/problems/', query)
    .get('/:workspaceId/problems/:subproblemId', get)
    .post('/:workspaceId/problems/', create)
    .post('/:workspaceId/problems/:subproblemId', update)
    .delete('/:workspaceId/problems/:subproblemId', del);
}

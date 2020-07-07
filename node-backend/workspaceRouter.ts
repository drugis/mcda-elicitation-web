'use strict';
import express from 'express';
import WorkspaceHandler from './workspaceHandler';

export default function WorkspaceRouter(db: any) {
  const workspaceHandler = WorkspaceHandler(db);
  const {query, create, get, update, delete: del} = workspaceHandler;

  return express
    .Router()
    .get('/', query)
    .post('/', create)
    .get('/:id', get)
    .post('/:id', update)
    .delete('/:id', del);
}

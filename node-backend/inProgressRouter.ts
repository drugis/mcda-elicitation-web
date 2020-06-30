import express from 'express';
import InProgressHandler from './inProgressWorkspaceHandler';
export default function InProgressRouter(db: any) {
  const inProgressHandler = InProgressHandler(db);
  return express
    .Router()
    .post('/', inProgressHandler.create)
    .get('/', inProgressHandler.query)
    .get('/:id', inProgressHandler.get)
    .delete('/:id', inProgressHandler.delete)
    .put('/:id', inProgressHandler.updateWorkspace)

    .put('/:id/criteria/:criterionId', inProgressHandler.updateCriterion)
    .delete('/:id/criteria/:criterionId', inProgressHandler.deleteCriterion)

    .put(
      '/:id/criteria/:criterionId/dataSources/:dataSourceId',
      inProgressHandler.updateDataSource
    )
    .delete(
      '/:id/criteria/:criterionId/dataSources/:dataSourceId',
      inProgressHandler.deleteDataSource
    )

    .put(
      '/:id/alternatives/:alternativeId',
      inProgressHandler.updateAlternative
    )
    .delete(
      '/:id/alternatives/:alternativeId',
      inProgressHandler.deleteAlternative
    )
    .put('/:id/cells', inProgressHandler.updateCell)

    .post('/:id/doCreateWorkspace', inProgressHandler.createWorkspace);
}
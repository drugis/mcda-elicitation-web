import {Router} from 'express';
import InProgressHandler from './inProgressHandler';
import IDB from './interface/IDB';

export default function InProgressRouter(db: IDB) {
  const {
    createEmpty,
    query,
    get,
    delete: del,
    updateWorkspace,
    createCopy,
    updateCriterion,
    deleteCriterion,
    updateDataSource,
    deleteDataSource,
    updateAlternative,
    deleteAlternative,
    updateCell,
    createWorkspace
  } = InProgressHandler(db);
  return Router()
    .post('/', createEmpty)
    .get('/', query)
    .get('/:id', get)
    .delete('/:id', del)
    .put('/:id', updateWorkspace)

    .post('/createCopy', createCopy)

    .put('/:id/criteria/:criterionId', updateCriterion)
    .delete('/:id/criteria/:criterionId', deleteCriterion)

    .put(
      '/:id/criteria/:criterionId/dataSources/:dataSourceId',
      updateDataSource
    )
    .delete(
      '/:id/criteria/:criterionId/dataSources/:dataSourceId',
      deleteDataSource
    )

    .put('/:id/alternatives/:alternativeId', updateAlternative)
    .delete('/:id/alternatives/:alternativeId', deleteAlternative)
    .put('/:id/cells', updateCell)

    .post('/:id/doCreateWorkspace', createWorkspace);
}

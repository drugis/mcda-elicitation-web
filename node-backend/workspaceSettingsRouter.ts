'use strict';

import {Router} from 'express';
import WorkspaceSettingsHandler from './workspaceSettingsHandler';
import IDB from './interface/IDB';

export default function WorkspaceSettingsRouter(db: IDB) {
  const {get, put} = WorkspaceSettingsHandler(db);
  return Router()
    .get('/:workspaceId/workspaceSettings', get)
    .put('/:workspaceId/workspaceSettings', put);
}

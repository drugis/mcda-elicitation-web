import IRights, {requiredRightType} from '@shared/interface/IRights';
import {Response} from 'express';

export default function getRequiredRights(
  workspaceOwnerRightsNeeded: (
    response: Response,
    next: any,
    workspaceId: string,
    userId: number
  ) => void,
  inProgressOwnerRightsNeeded: (
    response: Response,
    next: any,
    workspaceId: string,
    userId: number
  ) => void
): IRights[] {
  return [
    makeRights('/patavi', 'POST', 'none'),
    makeRights('/patavi/weights', 'POST', 'none'),
    makeRights('/patavi/scales', 'POST', 'none'),
    makeRights('/patavi/smaaResults', 'POST', 'none'),
    makeRights('/patavi/deterministicResults', 'POST', 'none'),
    makeRights('/patavi/recalculateDeterministicResults', 'POST', 'none'),
    makeRights('/patavi/measurementsSensitivity', 'POST', 'none'),
    makeRights('/patavi/preferencesSensitivity', 'POST', 'none'),

    makeRights('/workspaces', 'GET', 'none'),
    makeRights('/workspaces', 'POST', 'none'),

    makeRights('/premades', 'GET', 'none'),
    makeRights('/workspaces/createPremade', 'POST', 'none'),

    makeRights(
      '/workspaces/:workspaceId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId',
      'DELETE',
      'owner',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/api/v2/inProgress',
      'GET',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress',
      'POST',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId',
      'GET',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/cells',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/doCreateWorkspace',
      'POST',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/createCopy',
      'POST',
      'none',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/ordering',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/ordering',
      'PUT',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/workspaceSettings',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/workspaceSettings',
      'PUT',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/problems',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId',
      'DELETE',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/scenarios',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId/scenarios',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId/scenarios',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      'DELETE',
      'write',
      workspaceOwnerRightsNeeded
    )
  ];
}

function makeRights(
  path: string,
  method: string,
  requiredRight: requiredRightType,
  checkRights?: (
    response: Response,
    next: any,
    workspaceId: string,
    userId: number
  ) => void
): IRights {
  return {
    path: path,
    method: method,
    requiredRight: requiredRight,
    checkRights: checkRights
  };
}

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
    makeRights('/v2/patavi', 'POST', 'none'),
    makeRights('/v2/patavi/weights', 'POST', 'none'),
    makeRights('/v2/patavi/scales', 'POST', 'none'),
    makeRights('/v2/patavi/smaaResults', 'POST', 'none'),
    makeRights('/v2/patavi/deterministicResults', 'POST', 'none'),
    makeRights('/v2/patavi/recalculateDeterministicResults', 'POST', 'none'),
    makeRights('/v2/patavi/measurementsSensitivity', 'POST', 'none'),
    makeRights('/v2/patavi/preferencesSensitivity', 'POST', 'none'),

    makeRights('/v2/workspaces', 'GET', 'none'),
    makeRights('/v2/workspaces', 'POST', 'none'),

    makeRights('/v2/premades', 'GET', 'none'),
    makeRights('/v2/workspaces/createPremade', 'POST', 'none'),

    makeRights(
      '/v2/workspaces/:workspaceId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId',
      'DELETE',
      'owner',
      workspaceOwnerRightsNeeded
    ),

    makeRights('/v2/inProgress', 'GET', 'none', inProgressOwnerRightsNeeded),
    makeRights('/v2/inProgress', 'POST', 'none', inProgressOwnerRightsNeeded),
    makeRights(
      '/v2/inProgress/:inProgressId',
      'GET',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/cells',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/doCreateWorkspace',
      'POST',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/createCopy',
      'POST',
      'none',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/ordering',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/ordering',
      'PUT',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/workspaceSettings',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/workspaceSettings',
      'PUT',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/problems',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId',
      'DELETE',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/scenarios',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      'PUT',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
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

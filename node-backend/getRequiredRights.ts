import IRights, {requiredRightType} from '@shared/interface/IRights';
import {Response} from 'express';

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const NONE = 'none';
const READ = 'read';
const WRITE = 'write';
const OWNER = 'owner';

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
    makeRights('/v2/patavi', POST, NONE),
    makeRights('/v2/patavi/choice-based-matching-state', POST, NONE),
    makeRights('/v2/patavi/weights', POST, NONE),
    makeRights('/v2/patavi/scales', POST, NONE),
    makeRights('/v2/patavi/smaaResults', POST, NONE),
    makeRights('/v2/patavi/deterministicResults', POST, NONE),
    makeRights('/v2/patavi/recalculateDeterministicResults', POST, NONE),
    makeRights('/v2/patavi/measurementsSensitivity', POST, NONE),
    makeRights('/v2/patavi/preferencesSensitivity', POST, NONE),

    makeRights('/v2/workspaces', GET, NONE),
    makeRights('/v2/workspaces', POST, NONE),

    makeRights('/v2/premades', GET, NONE),
    makeRights('/v2/workspaces/createPremade', POST, NONE),

    makeRights(
      '/v2/workspaces/:workspaceId',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId',
      POST,
      WRITE,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId',
      DELETE,
      OWNER,
      workspaceOwnerRightsNeeded
    ),

    makeRights('/v2/inProgress', GET, NONE, inProgressOwnerRightsNeeded),
    makeRights('/v2/inProgress', POST, NONE, inProgressOwnerRightsNeeded),
    makeRights(
      '/v2/inProgress/:inProgressId',
      GET,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId',
      DELETE,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId',
      PUT,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId',
      PUT,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId',
      DELETE,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      PUT,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      DELETE,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      PUT,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      DELETE,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/cells',
      PUT,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/:inProgressId/doCreateWorkspace',
      POST,
      NONE,
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/v2/inProgress/createCopy',
      POST,
      NONE,
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/ordering',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/ordering',
      PUT,
      WRITE,
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/workspaceSettings',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/workspaceSettings',
      PUT,
      WRITE,
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/problems',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems',
      POST,
      WRITE,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId',
      POST,
      WRITE,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId',
      DELETE,
      WRITE,
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/v2/workspaces/:workspaceId/scenarios',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      GET,
      READ,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios',
      POST,
      WRITE,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      PUT,
      WRITE,
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/v2/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      DELETE,
      WRITE,
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

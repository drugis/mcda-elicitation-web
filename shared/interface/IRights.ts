import {Response} from 'express';

export type requiredRightType = 'none' | 'read' | 'write' | 'owner' | 'admin';

export default interface IRights {
  path: string;
  method: string;
  requiredRight: requiredRightType;
  checkRights: (
    response: Response<any>,
    next: any,
    workspaceId: string,
    userId: number
  ) => void;
}

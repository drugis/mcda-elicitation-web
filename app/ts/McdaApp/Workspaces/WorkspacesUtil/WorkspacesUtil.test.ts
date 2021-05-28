import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import {getLink} from './WorkspacesUtil';

describe('WorkspacesUtil', () => {
  describe('getLink', () => {
    it('should return a complete link to the workspace', () => {
      const workspace = {
        id: '1',
        defaultSubProblemId: '10',
        defaultScenarioId: '100'
      } as IWorkspaceSummary;
      const result = getLink(workspace);
      const expectedResult = '/workspaces/1/problems/10/scenarios/100/overview';
      expect(result).toEqual(expectedResult);
    });
  });
});

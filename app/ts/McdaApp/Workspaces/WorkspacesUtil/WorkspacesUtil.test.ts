import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import {filterWorkspaces, getLink} from './WorkspacesUtil';

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

  describe('filterWorkspaces', () => {
    const workspaces: IWorkspaceSummary[] = [
      {
        id: 'include',
        criteria: ['c1', 'c2'],
        alternatives: ['a1', 'a2']
      } as IWorkspaceSummary,
      {
        id: 'skip',
        criteria: ['c3', 'c4'],
        alternatives: ['a3', 'a4']
      } as IWorkspaceSummary
    ];

    it('should return workspaces that include the criteria and alternatives provided, ignoring the capitalization', () => {
      const result = filterWorkspaces(workspaces, ['a1', 'A2'], ['c1', 'C2']);
      const expectedResult = [
        {
          id: 'include',
          criteria: ['c1', 'c2'],
          alternatives: ['a1', 'a2']
        } as IWorkspaceSummary
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return workspaces that include the criteria with no alternatives requested', () => {
      const result = filterWorkspaces(workspaces, [], ['c1', 'c2']);
      const expectedResult = [
        {
          id: 'include',
          criteria: ['c1', 'c2'],
          alternatives: ['a1', 'a2']
        } as IWorkspaceSummary
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return an empty array if no workspace includes all requested criteria', () => {
      const result = filterWorkspaces(workspaces, [], ['c1', 'c3']);
      expect(result).toEqual([]);
    });

    it('should return an empty array if no workspace includes all requested alternatives', () => {
      const result = filterWorkspaces(workspaces, ['a1', 'a3'], []);
      expect(result).toEqual([]);
    });
  });
});

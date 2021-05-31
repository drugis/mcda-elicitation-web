import ICriterion from '@shared/interface/ICriterion';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import {
  extractUniqueAlternatives,
  extractUniqueCriteria,
  filterWorkspaces,
  getLink
} from './workspacesUtil';

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

  describe('extractUniqueCriteria', () => {
    it('should return a list of every unique criterion', () => {
      const workspaces: IWorkspaceSummary[] = [
        {criteria: ['criterion 1', 'criterion 2']},
        {criteria: ['criterion 2', 'criterion 3']}
      ] as IWorkspaceSummary[];
      const result = extractUniqueCriteria(workspaces);
      const expectedResult: string[] = [
        'criterion 1',
        'criterion 2',
        'criterion 3'
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('extractUniqueAlternatives', () => {
    it('should return a list of every unique alternative', () => {
      const workspaces: IWorkspaceSummary[] = [
        {alternatives: ['alternative 1', 'alternative 2']},
        {alternatives: ['alternative 2', 'alternative 3']}
      ] as IWorkspaceSummary[];
      const result = extractUniqueAlternatives(workspaces);
      const expectedResult: string[] = [
        'alternative 1',
        'alternative 2',
        'alternative 3'
      ];
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
      const includedAlternatives = ['a1', 'A2'];
      const includedCriteria = ['c1', 'C2'];
      const result = filterWorkspaces(
        workspaces,
        includedAlternatives,
        includedCriteria
      );
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
      const includedAlternatives: string[] = [];
      const includedCriteria = ['c1', 'C2'];
      const result = filterWorkspaces(
        workspaces,
        includedAlternatives,
        includedCriteria
      );
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
      const includedAlternatives: string[] = [];
      const includedCriteria = ['c1', 'c3'];
      const result = filterWorkspaces(
        workspaces,
        includedAlternatives,
        includedCriteria
      );
      expect(result).toEqual([]);
    });

    it('should return an empty array if no workspace includes all requested alternatives', () => {
      const includedAlternatives: string[] = ['a1', 'a3'];
      const includedCriteria: string[] = [];
      const result = filterWorkspaces(
        workspaces,
        includedAlternatives,
        includedCriteria
      );
      expect(result).toEqual([]);
    });
  });
});

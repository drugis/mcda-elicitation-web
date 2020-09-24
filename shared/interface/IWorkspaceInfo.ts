import IProblem from './Problem/IProblem';

export default interface IWorkspaceInfo {
  id: number;
  owner: number;
  problem: IProblem;
  defaultSubProblemId: string;
  defaultScenarioId: string;
}

import IProblem from './Problem/IProblem';

export default interface IWorkspaceInfo {
  id: number;
  owner: number;
  problem: IProblem;
  defaultSubproblemId: number;
  defaultScenarioId: number;
}

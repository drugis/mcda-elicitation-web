import IProblem from './Problem/IProblem';

export default interface IWorkspace {
  id: number;
  owner: number;
  problem: IProblem;
  defaultSubproblemId: number;
  defaultScenarioId: number;
}

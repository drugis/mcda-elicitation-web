import IProblem from './Problem/IProblem';

export default interface IOldWorkspace {
  id: number;
  owner: number;
  problem: IProblem;
  defaultSubproblemId: number;
  defaultScenarioId: number;
}

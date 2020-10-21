import IProblem from './Problem/IProblem';

export default interface IOldWorkspace {
  owner: number;
  problem: IProblem;
  defaultSubproblemId: string;
  defaultScenarioId: string;
}

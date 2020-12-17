import IProblem from './Problem/IProblem';

export default interface IOldWorkspace {
  id: string;
  title: string;
  owner: number;
  problem: IProblem;
  defaultSubProblemId: string;
  defaultScenarioId: string;
}

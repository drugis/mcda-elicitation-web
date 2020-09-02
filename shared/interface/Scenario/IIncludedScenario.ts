import IIncludedScenarioState from './IIncludedScenarioState';

export default interface IIncludedScenario {
  id: number;
  subproblemId: number;
  workspaceId: number;
  title: string;
  state: IIncludedScenarioState;
}

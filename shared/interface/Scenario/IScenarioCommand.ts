import IScenarioState from './IScenarioState';

export default interface IScenarioCommand {
  title: string;
  state: IScenarioState;
  subproblemId: string;
  workspaceId: string;
}

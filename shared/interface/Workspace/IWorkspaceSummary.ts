export default interface IWorkspaceSummary {
  id: string;
  title: string;
  owner: number;
  criteria: string[];
  alternatives: string[];
  defaultSubProblemId: string;
  defaultScenarioId: string;
  creationDate: string;
}

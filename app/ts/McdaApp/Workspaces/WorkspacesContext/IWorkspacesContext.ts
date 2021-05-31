import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';

export default interface IWorkspacesContext {
  availableAlternatives: string[];
  availableCriteria: string[];
  filteredWorkspaces: IWorkspaceSummary[];
  filterByAlternatives: (alternatives: string[]) => void;
  filterByCriteria: (criteria: string[]) => void;
}

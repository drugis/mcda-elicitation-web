import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';

export default interface IWorkspacesContext {
  availableAlternatives: string[];
  availableCriteria: string[];
  filteredWorkspaces: IWorkspaceSummary[];
  inProgressWorkspaces: IInProgressWorkspaceProperties[];
  deleteWorkspace: (id: string) => void;
  filterByAlternatives: (alternatives: string[]) => void;
  filterByCriteria: (criteria: string[]) => void;
}

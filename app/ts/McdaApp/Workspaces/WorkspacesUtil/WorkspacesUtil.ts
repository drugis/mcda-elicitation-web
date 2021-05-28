import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';

export function getLink(workspace: IWorkspaceSummary): string {
  return (
    '/workspaces/' +
    workspace.id +
    '/problems/' +
    workspace.defaultSubProblemId +
    '/scenarios/' +
    workspace.defaultScenarioId +
    '/overview'
  );
}

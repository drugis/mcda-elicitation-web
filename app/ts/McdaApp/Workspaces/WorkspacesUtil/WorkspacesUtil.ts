import IOldWorkspace from '@shared/interface/IOldWorkspace';

export function getLink(workspace: IOldWorkspace): string {
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

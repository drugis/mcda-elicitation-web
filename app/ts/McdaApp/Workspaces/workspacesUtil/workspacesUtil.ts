import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import _ from 'lodash';

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

export function extractUniqueCriteria(
  workspaces: IWorkspaceSummary[]
): string[] {
  return _.uniq(_.flatMap(workspaces, 'criteria'));
}

export function extractUniqueAlternatives(
  workspaces: IWorkspaceSummary[]
): string[] {
  return _.uniq(_.flatMap(workspaces, 'alternatives'));
}

export function filterWorkspaces(
  workspaces: IWorkspaceSummary[],
  alternatives: string[],
  criteria: string[]
): IWorkspaceSummary[] {
  const criteriaInLowerCase = _.map(criteria, _.method('toLowerCase'));
  const alternativesInLowerCase = _.map(alternatives, _.method('toLowerCase'));

  return _.filter(workspaces, (workspace: IWorkspaceSummary): boolean => {
    const workspaceCriteriaInLowerCase = _.map(
      workspace.criteria,
      _.method('toLowerCase')
    );
    const workspaceAlternativesInLowerCase = _.map(
      workspace.alternatives,
      _.method('toLowerCase')
    );

    const includesCriteria = doesWorkspaceIncludeCriteria(
      workspaceCriteriaInLowerCase,
      criteriaInLowerCase
    );
    const includesAlternatives = doesWorkspaceIncludeAlternatives(
      workspaceAlternativesInLowerCase,
      alternativesInLowerCase
    );
    return includesCriteria && includesAlternatives;
  });
}

function doesWorkspaceIncludeCriteria(
  workspaceCriteria: string[],
  criteriaToInclude: string[]
): boolean {
  return (
    _.isEmpty(criteriaToInclude) ||
    doAllInclude(workspaceCriteria, criteriaToInclude)
  );
}

function doesWorkspaceIncludeAlternatives(
  workspaceAlternatives: string[],
  alternativesToInclude: string[]
): boolean {
  return (
    _.isEmpty(alternativesToInclude) ||
    doAllInclude(workspaceAlternatives, alternativesToInclude)
  );
}

function doAllInclude(items: string[], itemsNeeded: string[]): boolean {
  return itemsNeeded.length === _.intersection(items, itemsNeeded).length;
}

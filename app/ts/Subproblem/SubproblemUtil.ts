import IOldSubproblem from '@shared/interface/IOldSubproblem';
import _ from 'lodash';

export function checkSubproblemTitleErrors(
  newTitle: string,
  subproblems: Record<string, IOldSubproblem>,
  curretSubproblemId?: string
): string[] {
  const errors = [];
  if (!newTitle) {
    errors.push('Empty title');
  }

  if (isDuplicate(newTitle, subproblems, curretSubproblemId)) {
    errors.push('Duplicate title');
  }

  return errors;
}

function isDuplicate(
  title: string,
  subproblems: Record<string, IOldSubproblem>,
  curretSubproblemId: string
): boolean {
  return _.some(subproblems, (subproblem) => {
    return subproblem.title === title && subproblem.id !== curretSubproblemId;
  });
}

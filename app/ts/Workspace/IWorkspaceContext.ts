import IOldSubproblem from '@shared/interface/IOldSubproblem';

export default interface IWorkspaceContext {
  subproblems: Record<string, IOldSubproblem>;
  currentSubproblem: IOldSubproblem;
  editTitle: (title: string) => void;
  deleteSubproblem: (subproblemId: string) => void;
}

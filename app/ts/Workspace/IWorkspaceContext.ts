import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';

export default interface IWorkspaceContext {
  subproblems: Record<string, IOldSubproblem>;
  currentSubproblem: IOldSubproblem;
  editTitle: (title: string) => void;
  deleteSubproblem: (subproblemId: string) => void;
  workspace: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
  createSubProblemDialogCallback: () => void;
}

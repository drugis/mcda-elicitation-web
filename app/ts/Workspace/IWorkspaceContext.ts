import IAlternative from '@shared/interface/IAlternative';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';

export default interface IWorkspaceContext {
  alternatives: Record<string, IAlternative>;
  currentSubproblem: IOldSubproblem;
  observedRanges: Record<string, [number, number]>;
  scales: Record<string, Record<string, IScale>>;
  subproblems: Record<string, IOldSubproblem>;
  workspace: IOldWorkspace;
  createSubProblemDialogCallback: () => void;
  deleteSubproblem: (subproblemId: string) => void;
  editTitle: (title: string) => void;
}

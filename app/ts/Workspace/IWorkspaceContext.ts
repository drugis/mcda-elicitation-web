import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IScale from '@shared/interface/IScale';
import IWorkspace from '@shared/interface/IWorkspace';
import IOldSubproblem from 'app/ts/interface/IOldSubproblem';

export default interface IWorkspaceContext {
  alternatives: Record<string, IAlternative>;
  criteria: Record<string, ICriterion>;
  currentSubproblem: IOldSubproblem;
  observedRanges: Record<string, [number, number]>;
  scales: Record<string, Record<string, IScale>>;
  subproblems: Record<string, IOldSubproblem>;
  workspace: IWorkspace;
  createSubproblemDialogCallback: () => void;
  deleteSubproblem: (subproblemId: string) => void;
  editTitle: (title: string) => void;
}

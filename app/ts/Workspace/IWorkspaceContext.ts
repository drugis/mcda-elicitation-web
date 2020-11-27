import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IScale from '@shared/interface/IScale';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import IWorkspace from '@shared/interface/IWorkspace';
import IPvf from '@shared/interface/Problem/IPvf';

export default interface IWorkspaceContext {
  alternatives: Record<string, IAlternative>;
  criteria: Record<string, ICriterion>;
  currentSubproblem: IOldSubproblem;
  observedRanges: Record<string, [number, number]>;
  scales: Record<string, Record<string, IScale>>;
  subproblems: Record<string, IOldSubproblem>;
  subproblemPvfs: Record<string, IPvf>;
  workspace: IWorkspace;
  deleteSubproblem: (subproblemId: string) => void;
  editTitle: (title: string) => void;
  addSubproblem: (command: ISubproblemCommand) => void;
}

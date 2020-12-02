import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IScale from '@shared/interface/IScale';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import IWorkspace from '@shared/interface/IWorkspace';
import IProblem from '@shared/interface/Problem/IProblem';

export default interface IWorkspaceContext {
  alternatives: Record<string, IAlternative>;
  criteria: Record<string, ICriterion>;
  currentSubproblem: IOldSubproblem;
  observedRanges: Record<string, [number, number]>;
  oldProblem: IProblem;
  scales: Record<string, Record<string, IScale>>;
  subproblems: Record<string, IOldSubproblem>;
  therapeuticContext: string;
  workspace: IWorkspace;
  deleteSubproblem: (subproblemId: string) => void;
  editTitle: (title: string) => void;
  editTherapeuticContext: (therapeuticContext: string) => void;
  addSubproblem: (command: ISubproblemCommand) => void;
}

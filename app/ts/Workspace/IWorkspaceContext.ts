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
  addSubproblem: (command: ISubproblemCommand) => void;
  deleteSubproblem: (subproblemId: string) => void;
  editAlternative: (alternative: IAlternative, newTitle: string) => void;
  editCriterion: (criterion: ICriterion) => void;
  editTitle: (title: string) => void;
  editTherapeuticContext: (therapeuticContext: string) => void;
  swapAlternatives: (alternative1Id: string, alternative2Id: string) => void;
  swapCriteria: (criterion1Id: string, criterion2Id: string) => void;
  swapDataSources: (
    criterionId: string,
    dataSource1Id: string,
    dataSource2Id: string
  ) => void;
}

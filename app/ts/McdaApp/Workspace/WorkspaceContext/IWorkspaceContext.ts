import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IScale from '@shared/interface/IScale';
import IWorkspace from '@shared/interface/IWorkspace';
import IProblem from '@shared/interface/Problem/IProblem';

export default interface IWorkspaceContext {
  alternatives: Record<string, IAlternative>;
  criteria: Record<string, ICriterion>;
  oldProblem: IProblem;
  scales: Record<string, Record<string, IScale>>;
  therapeuticContext: string;
  workspace: IWorkspace;
  workspaceId: string;
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

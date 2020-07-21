import IAlternative from './IAlternative';
import IScale from './IScale';
import IWorkspace from './IWorkspace';

export default interface IEffectsTableContext {
  workspace: IWorkspace;
  alternatives: IAlternative[];
  scales: Record<string, Record<string, IScale>>;
  canBePercentage: (dataSourceId: string) => boolean;
}

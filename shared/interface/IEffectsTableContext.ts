import IAlternative from './IAlternative';
import IWorkspace from './IWorkspace';

export default interface IEffectsTableContext {
  workspace: IWorkspace;
  alternatives: IAlternative[];
}

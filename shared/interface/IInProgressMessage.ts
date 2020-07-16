import IAlternative from './IAlternative';
import ICriterion from './ICriterion';
import {Distribution} from './IDistribution';
import {Effect} from './IEffect';
import IWorkspaceProperties from './IWorkspaceProperties';

export default interface IInProgressMessage {
  workspace: IWorkspaceProperties;
  criteria: ICriterion[];
  alternatives: IAlternative[];
  effects: Record<string, Record<string, Effect>>;
  distributions: Record<string, Record<string, Distribution>>;
}

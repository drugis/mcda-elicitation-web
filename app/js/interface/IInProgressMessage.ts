import IAlternative from './IAlternative';
import ICriterion from './ICriterion';
import {Distribution} from './IDistribution';
import {Effect} from './IEffect';
import IInProgressWorkspace from './IInProgressWorkspace';

export default interface IInProgressMessage {
  workspace: IInProgressWorkspace;
  criteria: ICriterion[];
  alternatives: IAlternative[];
  effects: Record<string, Record<string, Effect>>;
  distributions: Record<string, Record<string, Distribution>>;
}

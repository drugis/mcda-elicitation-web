import IAlternative from './IAlternative';
import ICriterion from './ICriterion';
import {Distribution} from './IDistribution';
import {Effect} from './IEffect';
import IInProgressWorkspace from './IInProgressWorkspace';

export default interface IWorkspace {
  workspace: IInProgressWorkspace;
  criteria: ICriterion[];
  alternatives: IAlternative[];
  effects: Effect[];
  distributions: Distribution[];
}

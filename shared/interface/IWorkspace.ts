import IAlternative from './IAlternative';
import ICriterion from './ICriterion';
import {Distribution} from './IDistribution';
import {Effect} from './IEffect';
import IWorkspaceProperties from './IWorkspaceProperties';

export default interface IWorkspace {
  properties: IWorkspaceProperties;
  criteria: ICriterion[];
  alternatives: IAlternative[];
  effects: Effect[];
  distributions: Distribution[];
}

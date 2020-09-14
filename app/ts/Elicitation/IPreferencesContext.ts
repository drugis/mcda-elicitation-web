import IElicitationCriterion from './Interface/IElicitationCriterion';

export default interface IPreferencesContext {
  criteria: Record<string, IElicitationCriterion>;
}

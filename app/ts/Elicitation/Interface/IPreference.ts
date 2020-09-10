export type ElicitationMethod = 'ranking' | 'precise' | 'matching' | 'choice';

export default interface IPreference {
  elicitationMethod: ElicitationMethod;
}

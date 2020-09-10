export type ElicitationMethod =
  | 'ranking'
  | 'precise'
  | 'matching'
  | 'choice'
  | 'imprecise';

export default interface IPreference {
  elicitationMethod: ElicitationMethod;
}

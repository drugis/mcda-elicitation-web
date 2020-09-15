export type TElicitationMethod =
  | 'ranking'
  | 'precise'
  | 'matching'
  | 'choice'
  | 'imprecise';

export default interface IPreference {
  elicitationMethod: TElicitationMethod;
}

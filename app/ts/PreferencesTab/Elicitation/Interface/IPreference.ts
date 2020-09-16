export type TElicitationMethod =
  | 'ranking'
  | 'precise'
  | 'matching'
  | 'imprecise';

export default interface IPreference {
  elicitationMethod: TElicitationMethod;
}
